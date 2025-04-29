import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../app/models/user.model';
import { USERS_MOCK } from '../app/mocks/users.mock';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser: User | null = null;

    login(email: string, password: string): Observable<User> {
        const user = USERS_MOCK.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            // Simulando armazenamento no localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            return of(user);
        }

        return throwError(() => new Error('Email ou senha inválidos'));
    }

    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    isAuthenticated(): boolean {
        return !!this.currentUser || !!localStorage.getItem('currentUser');
    }

    getCurrentUser(): User | null {
        if (!this.currentUser) {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                this.currentUser = JSON.parse(storedUser);
            }
        }
        return this.currentUser;
    }
}
