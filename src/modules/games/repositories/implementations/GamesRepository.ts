import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository.createQueryBuilder("games")
    
    .where("lower(games.title) like lower(:param)", { param:`%${param}%` })
    .getMany()
    return games

      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const games = await this.repository.createQueryBuilder('games')
    .innerJoinAndSelect("games.users", "users")
    .getMany()
    
    const data = games.find(games => games.id === id)

    if(!data){
      throw new Error("Error")
    }
   
      return data?.users
  }
}
