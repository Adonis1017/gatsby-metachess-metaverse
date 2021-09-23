import { MODES } from "../../constants/playModes";
import {
  GameMode,
  PieceSide,
  ResultCondition,
} from "../../interfaces/game.interfaces";

export enum MAINTENANCE_MODE {
  ONLINE,
  GAMEPLAY_DISABLED,
  OFFLINE,
}
export interface IUserReducer {
  currentUser: IUser;
  matchesHistory: IMatchHistory[];
  serverStatus: IServerStatus;
  choseMode: MODES;
}

export interface IMatchHistory {
  BoardMoves: string;
  EloEarned: number;
  GameMode: GameMode;
  Id: number;
  Identifier: string;
  Opponent: IUser;
  PieceSide: PieceSide;
  Time: { base: number; increment: number };
  Winner: { Id?: number; GuestId?: number };
  StartDate: number;
  EndDate: number;
  ResultCondition: ResultCondition;
}

export interface IUser {
  Id: number;
  Username: string;
  Email: string;
  ClassicalElo: number;
  BlitzElo: number;
  BulletElo: number;
  RapidElo: number;
  GuestId?: number;
  WonGames: number;
}

export interface IServerStatus {
  Status: MAINTENANCE_MODE;
}