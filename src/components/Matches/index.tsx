import React, { useEffect } from "react";
import { Actions as userActions } from "../../store/user/user.action";
import { Actions as gameplayActions } from "../../store/gameplay/gameplay.action";
import { IAppState } from "../../store/reducers";
import { connect } from "react-redux";
import { IMatchHistory, IUser } from "../../store/user/user.interfaces";
import { navigate } from "gatsby";
import { PieceSide, GameMode } from "../../interfaces/game.interfaces";
import { getOpponentName } from "../../helpers/getOpponentNameByPlayMode";
import moment from "moment";
import { SVG_ASSETS } from "../../constants/svgAssets";
import { getGameTypeName } from "../../helpers/gameTypeHelper";

interface ISelectProps {
  matchesHistory: IMatchHistory[];
  currentUser: IUser;
}

interface IActionProps {
  fetchMatchesHistory: typeof userActions.fetchMatchesHistory;
  setHistoryWithTimestamp: typeof gameplayActions.setHistoryWithTimestamp;
  setIsReplay: typeof gameplayActions.setReplay;
  setGameRules: typeof gameplayActions.setGameRules;
  setGameEndDate: typeof gameplayActions.setGameEndDate;
  setGameStartDate: typeof gameplayActions.setGameStartDate;
  setGameWinner: typeof gameplayActions.setGameWinner;
  setPlayerColor: typeof gameplayActions.setPlayerColor;
  setOpponent: typeof gameplayActions.setOpponent;
  setPlayMode: typeof gameplayActions.setPlayMode;
}

interface IProps extends ISelectProps, IActionProps {}

const HEADERS = [
  {
    key: "identifier",
    headerName: `Identifier`,
    keyValue: "Identifier",
  },
  {
    key: "win?",
    headerName: `Win?`,
    keyValue: "real-winner",
  },
];

const Matches = (props: IProps) => {
  useEffect(() => {
    props.fetchMatchesHistory();
  }, []);
  const matchesHistory: any = props.matchesHistory && props.matchesHistory.map((t) => ({
    ...t,
    ["real-winner"]: t.Winner?.Id === props.currentUser?.Id ? "Win" : "Lost",
  }));

  const replayHistory = (matchHistory: IMatchHistory) => {
    props.setHistoryWithTimestamp(JSON.parse(matchHistory.BoardMoves));
    props.setIsReplay(true);
    props.setPlayMode({
      isAI: false,
      aiMode: null,
      isHumanVsHuman: true
    });
    const pieceSide = PieceSide.Black === matchHistory.PieceSide ? "b" : "w";
    props.setGameEndDate(matchHistory.EndDate);
    props.setGameStartDate(matchHistory.StartDate);
    props.setGameRules({
      time: matchHistory.Time,
      mode: matchHistory.GameMode,
    });
    props.setPlayerColor(pieceSide);
    props.setOpponent(matchHistory.Opponent);
    matchHistory.Winner && props.setGameWinner(
      matchHistory.Winner.Id === props.currentUser.Id
        ? pieceSide
        : pieceSide === "b"
        ? "w"
        : "b"
    );
    navigate("/game");
  };

  console.log("AA:", props.matchesHistory);


  return (
    <div className="matchesContainer shadowContainer">
      <div className="innerContent">
        <p className="sectionTitle">Matches</p>
      </div>

      <div className={"innerContent main-table"}>
        {!matchesHistory ? 
        <div>
          Loading...
        </div> :
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Opponent</th>
              <th>Result</th>
              <th>Mode</th>
              <th className={'text-center'}>Elo Earned</th>
              <th className={"text-center"}>Side</th>
              <th className={"text-center"}>Time</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {props.matchesHistory.map((x) => (
              <tr key={x.Id}>
                <td>
                  <div className={"ellipsis"}>
                    <p>{x.Identifier}</p>
                  </div>
                </td>

                <td>
                  <div>
                    <p>{getOpponentName(false, null, x.Opponent as any)}</p>
                  </div>
                </td>

                <td>
                  <div>
                    <p
                      className={`${
                        !x.Winner ? "draw" :
                        x.Winner.Id === props.currentUser.Id
                          ? "victory"
                          : "defeat"
                      }`}
                    >
                      {!x.Winner ? "Draw" :
                        x.Winner.Id === props.currentUser.Id
                        ? "Victory"
                        : "Defeat"}
                    </p>
                  </div>
                </td>
                <td>
                  <div>
                    <p className="mode">{`${getGameTypeName(x.Time.base)} - ${(x.GameMode == GameMode.Casual ? "Casual" : "Rated")}`}</p>
                  </div>
                </td>
                <td>
                  <div>
                    <p className={'text-center'}>{x.GameMode == GameMode.Casual ? "-" : <span className={x.EloEarned > 0 ? "victory" : "defeat"}>{`${x.EloEarned > 0 ? "+" : ""}${x.EloEarned}`}</span>}</p>
                  </div>
                </td>

                <td>
                  <div className={"side"}>
                    {x.PieceSide === PieceSide.Black ? (
                      <img src={SVG_ASSETS.bSide} />
                    ) : x.PieceSide === PieceSide.White && (
                      <img src={SVG_ASSETS.wSide} />
                    )}
                    {/* {x.PieceSide === PieceSide.Random && (
                      <img src={SVG_ASSETS.bwSide} />
                    )} */}
                  </div>
                </td>

                <td>
                  <div>
                    <p className={'text-center'}>{`${x.Time.base}+${x.Time.increment}`}</p>
                  </div>
                </td>

                <td>
                  <div>
                    <p>{`${moment(x.StartDate).format(
                      `DD/MM/YYYY hh:mm:ss`
                    )}`}</p>
                  </div>
                </td>

                <td>
                  <div>
                    <button onClick={() => replayHistory(x)} className={"btn"}>Replay</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        }
        {/* {HEADERS.map((t) => (
          <div key={t.key} className={"column"}>
            <div className={"header"}>
              <p>{t.headerName}</p>
            </div>
            {matchesHistory.map((q: any) => (
              <div
                onClick={() => replayHistory(q)}
                key={q.Identifier}
                className={"cell"}
              >
                <p>{q[t.keyValue]}</p>
              </div>
            ))}
          </div>
        ))} */}
      </div>
    </div>
  );
};

const mapStateToProps = ({
  user: { matchesHistory, currentUser },
}: IAppState): ISelectProps => ({ matchesHistory, currentUser });

export default connect<ISelectProps, IActionProps>(mapStateToProps as any, {
  fetchMatchesHistory: userActions.fetchMatchesHistory,
  setHistoryWithTimestamp: gameplayActions.setHistoryWithTimestamp,
  setIsReplay: gameplayActions.setReplay,
  setGameRules: gameplayActions.setGameRules,
  setGameEndDate: gameplayActions.setGameEndDate,
  setGameStartDate: gameplayActions.setGameStartDate,
  setGameWinner: gameplayActions.setGameWinner,
  setPlayerColor: gameplayActions.setPlayerColor,
  setPlayMode: gameplayActions.setPlayMode,  
  setOpponent: gameplayActions.setOpponent,
})(Matches);
