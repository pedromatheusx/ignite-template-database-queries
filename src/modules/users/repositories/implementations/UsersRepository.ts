import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({user_id}: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.createQueryBuilder('users')
    .innerJoinAndSelect("users.games", "games")
    .getMany()

   const data = user.find(user => user.id === user_id)

   if(!data){
    throw new Error("Error")
   }

    return data
    
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const user = await this.repository.query('select * from users order by first_name asc');

    return user 
    // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`select * from users where lower(first_name) = lower('${first_name}') and lower(last_name) = lower('${last_name}')`); // Complete usando raw query
  }
}
