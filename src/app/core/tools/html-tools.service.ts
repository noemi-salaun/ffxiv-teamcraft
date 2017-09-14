import {Injectable} from '@angular/core';

@Injectable()
export class HtmlToolsService {

    constructor() {
    }

    public generateStars(amount: number): string {
        let stars = '';
        for (let i = 0; i < amount; i++) {
            stars += '★';
        }
        return stars;
    }

}
