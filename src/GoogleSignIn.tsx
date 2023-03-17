import React from "react";

interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback: (handleCredentialResponse: CredentialResponse) => void;
  login_uri?: string;
  native_callback?: Function;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: "popup" | "redirect";
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: Function;
}

export interface CredentialResponse {
  credential?: string;
  select_by?: "auto" | "user" | "user_1tap" | "user_2tap" | "btn" | "btn_confirm" | "brn_add_session" | "btn_confirm_add_session";
  clientId?: string;
}

export interface GsiButtonConfiguration {
  type: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signup_with";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: string;
  local?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => "browser_not_supported" | "invalid_client" | "missing_client_id" | "opt_out_or_no_session" | "secure_http_required" | "suppressed_by_user" | "unregistered_origin" | "unknown_reason";
  isSkippedMoment: () => boolean;
  getSkippedReason: () => "auto_cancel" | "user_cancel" | "tap_outside" | "issuing_failed";
  isDismissedMoment: () => boolean;
  getDismissedReason: () => "credential_returned" | "cancel_called" | "flow_restarted";
  getMomentType: () => "display" | "skipped" | "dismissed";
}

type FuncStoreCredential = (credentials: { id: string; password: string }, callback: Function) => void;

type FuncRevoke = (hint: string, callback: (successful: boolean, error: string) => void) => void;

export interface Google {
  accounts: {
    id: {
      initialize: (input: IdConfiguration) => void;
      prompt: (momentListener?: (res: PromptMomentNotification) => void) => void;
      renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
      disableAutoSelect: FuncStoreCredential;
      cancel: () => void;
      onGoogleLibraryLoad: Function;
      revoke: FuncRevoke;
    };
  };
}

declare global {
  var google: Google;
}

// const gsiClientId: string = "1058359876929-6esuhjomsh3dlk2ncf6cjju004rs95fl.apps.googleusercontent.com";
const gsiScriptId: string = "gsiScript";
const gsiButtonId: string = "gsiButton";

interface GoogleSignInProps {
  clientId: string;
  callback: Function;
  buttonConfig?: GsiButtonConfiguration;
}

export class GoogleSignIn extends React.Component<GoogleSignInProps, any> {
  gsiScriptLoaded: boolean = false;
  user: any = undefined;

  constructor(props: GoogleSignInProps) {
    super(props);
    this.gsiInitialize = this.gsiInitialize.bind(this);
    this.gsiSignIn = this.gsiSignIn.bind(this);
  }

  componentDidMount() {
    if (this.user || this.gsiScriptLoaded) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = this.gsiInitialize;
    script.async = true;
    script.id = gsiScriptId;
    document.querySelector("body")?.appendChild(script);
  }

  componentWillUnmount() {
    globalThis.google.accounts.id.cancel();
    // document.getElementById(gsiScriptId)?.remove();
  }

  gsiInitialize() {
    if (!globalThis.google || this.gsiScriptLoaded) return;

    this.gsiScriptLoaded = true;
    globalThis.google.accounts.id.initialize({
      client_id: this.props.clientId,
      callback: this.gsiSignIn,
      // auto_select?: boolean
      // login_uri?: string
      // native_callback?: Function
      // cancel_on_tap_outside?: boolean
      // prompt_parent_id?: string
      // nonce?: string
      // context?: string
      // state_cookie_domain?: string
      // ux_mode?: "popup" | "redirect"
      // allowed_parent_origin?: string | string[]
      // intermediate_iframe_close_callback?: Function
    });

    const buttonConfig: GsiButtonConfiguration = {
      type: "standard",
      theme: "filled_blue",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      // logo_alignment: "center",
      // width: "300px",
      // local: "ID-id",
    };

    globalThis.google.accounts.id.renderButton(document.getElementById(gsiButtonId)!, this.props.buttonConfig ? this.props.buttonConfig : buttonConfig);

    globalThis.google.accounts.id.prompt(); // also display the One Tap dialog
  }

  gsiSignIn(res: CredentialResponse) {
    if (!res.clientId || !res.credential) return;
    if (this.props.callback) this.props.callback(res);
    globalThis.google?.accounts.id.cancel();
    // document.getElementById(gsiButtonId)?.remove();
  }

  render() {
    return <div id={gsiButtonId}></div>;
  }
}
