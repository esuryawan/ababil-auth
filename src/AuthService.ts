import axios, { Axios, AxiosRequestHeaders, AxiosStatic } from 'axios'
import { User } from './User';

declare global {
	var Ababil_AuthAPI_URL: string;
}

globalThis.Ababil_AuthAPI_URL = 'http://localhost:8590/api/auth/';

export class AuthService {
	// ---------------------------------------------------------------------
	// Authentication methods
	// ---------------------------------------------------------------------
	async signin(data: any) {
		const response = await axios.post(globalThis.Ababil_AuthAPI_URL + "signin", data);
		if (response.data.AccessToken) {
			this.setLogin(response.data);
		}
		return response.data;
	}

	async signout() {
		this.setAccessToken(axios);
		const response = await axios.post(globalThis.Ababil_AuthAPI_URL + "signout");
		return response.data;
	}

	setLogin(login: User) {
		// let n = new Date();
		// n.setMinutes(n.getMinutes() + 5); // expired after 5 minutes
		// login.ExpiredAt = n;
		localStorage.setItem("login", JSON.stringify(login));
	}

	getLogin(): User | undefined {
		let login = JSON.parse(localStorage.getItem("login")!);
		if (login && login.ExpiredAt) {
			let nw = new Date();
			let dt = new Date(login.ExpiredAt);
			if (dt < nw) {
				this.logout();
				return undefined;
			} else {
				return login;
			}
		} else {
			return undefined;
		}
	}

	updateToken(login: User | undefined, newtoken: string | undefined) {
		if (login && newtoken) {
			login.AccessToken = newtoken;
			this.setLogin(login);
		}
	}

	logout() {
		localStorage.removeItem("login");
	}

	setAccessToken(axios: AxiosStatic) {
		const login = this.getLogin();
		if (login && login.AccessToken) {
			axios.defaults.headers.common['x-access-token'] = login.AccessToken
		}
	};

}

export var theAuthService = new AuthService();
