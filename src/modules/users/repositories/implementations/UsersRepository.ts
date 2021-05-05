import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const user = this.repository.findOne({ id: user_id }, { relations: ["games"] });

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY first_name';
    const users = await this.repository.query(query);
    return users;
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const query = `
      SELECT * FROM users
      WHERE LOWER(first_name)=LOWER('${first_name}')
      AND LOWER(last_name)=LOWER('${last_name}')
      LIMIT 1
    `
    return this.repository.query(query);
  }
}
