import { flag } from "@/flags";
import { useEffect, useState } from "react";

type Entry = {
  username: string;
  level: number;
  attempts: number;
};

const Leaderboard = () => {
  const [leaderboardEntries, setLeaderboardEntries] = useState<Entry[]>([]);
  const leaderboardVisible = flag("showLeaderboard", false);
  const handleGetLeaderboard = async () => {
    await fetch("/api/leaderboard", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw Error();
        }
        return res.json();
      })
      .then((res) => setLeaderboardEntries(res.entries))
      .catch((error) => {
        console.log(error);
      });
  };
  // Get leaderboard on first render
  useEffect(() => {
    handleGetLeaderboard();
  }, []);

  return (
    <div>
      {leaderboardVisible ? (
        <div id="leaderboard" tabIndex={-1}>
          <div className="relative w-full max-w-lg max-h-full">
            <div className="relative bg-white rounded-lg">
              <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-medium">Leaderboard</h3>
              </div>
              <div className="space-y-6">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left bg-gray-100">
                        Username
                      </th>
                      <th className="px-4 py-2 text-left bg-gray-100">
                        Attempts
                      </th>
                      <th className="px-4 py-2 text-left bg-gray-100">Code Revealed?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {leaderboardEntries.map((entry, index) => {
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2">
                            {entry.username.split("@")[0]}
                          </td>
                          <td className="px-4 py-2">{entry.attempts}</td>
                          <td className="px-4 py-2">{entry.level == 2 ? "Yes" : "No"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Leaderboard;
