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
    return this.repository
      .createQueryBuilder('games')
      .where('games.title ILIKE :title', {title: `%${param}%`})
      .getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = "SELECT count(*) FROM games";
    return this.repository.query(query);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository.createQueryBuilder()
    .relation(Game, "users")
    .of(id)
    .loadMany()

    return users
  }
}