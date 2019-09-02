export class Movie {
    constructor(public id: string,
                public title: string,
                public description: string,
                public imageUrl: string,
                public rating: number,
                public year: number,
                public userId: string) {

    }
}
