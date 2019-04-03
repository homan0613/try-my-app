import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Hero } from './hero';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'applacation/json' })
};
@Injectable({
	providedIn: 'root'
})

export class HeroService {

	private heroesUrl ='api/heroes';
	constructor(
		private http: HttpClient,
		private messageService: MessageService
	) { }


	private log(message: string) {
		this.messageService.add(`heroservise : ${message}`)
	}

	getHeroes(): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetched Heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			)
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);
			this.log(`${operation} failed : ${error.message}`);
			return of(result as T);
		}
	}

	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url)
			.pipe(
				tap(_ => this.log(`fetched hero id=${id}`)),
				catchError(this.handleError<Hero>(`getHero id=${id}`))
			);
	}

	addHero(hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
			.pipe(
				tap((newHero: Hero) => this.log(`add hero /w id=${newHero.id}`)),
				catchError(this.handleError<Hero>(`addHero`))
			);
	}

	updateHero(hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, httpOptions)
			.pipe(
				tap(_ => this.log(`update hero id=${hero.id}`)),
				catchError(this.handleError<any>(`updateHero`))
			);
	}

	deleteHero(hero: Hero): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, httpOptions)
			.pipe(
				tap(_ => this.log(`deleteHero id= ${hero.id}`)),
				catchError(this.handleError<Hero>(`deleteHero`))
			);
	}

	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			return of([]);
		}

		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`)
			.pipe(
				tap(_ => this.log(` found heroes matching "${term}"`)),
				catchError(this.handleError<Hero[]>(`searchHero`,[]))
			);
	}

}
