import Head from "next/head";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import Game from "@/components/Game";
import Leaderboard from "@/components/Leaderboard";
import { useState, useEffect } from "react";
import EliizaLogo from "@/public/eliiza.svg";
import Image from "next/image";
import { useSmallScreen } from "@/utils/useSmallScreen";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [username, setUsername] = useState("");

  const getOrCreateUsername = async (session: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id);
    if (error) {
      console.log(error);
      return;
    }
    let username = "";
    if (data.length == 0) {
      username =
        (await supabase.auth.getUser()).data.user?.email ||
        "email.not.found@anywhere.com";
      await supabase
        .from("profiles")
        .insert({ id: session.user.id, username })
        .eq("id", session.user.id);
    } else {
      username = data[0].username;
    }
    setUsername(username);
  };

  useEffect(
    function onChange() {
      if (session) {
        getOrCreateUsername(session);
      }
    },
    [session]
  );

  const isSmallScreen = useSmallScreen();

  return (
    <>
      <Head>
        <title>PIG - Prompt Injection Game</title>
        <meta name="description" content="Prompt Injection Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center w-full h-screen">
        <div className="w-full max-w-5xl h-screen bg-white flex flex-col p-5">
          <nav className="flex h-14 flex-row items-center justify-between">
            <p className="font-sans text-3xl whitespace-nowrap">
              <Image
                src={EliizaLogo}
                alt="Eliiza logo"
                className="w-10 inline-block"
              />
              {isSmallScreen ? "" : "Prompt Injection Game"}
            </p>
            {session ? (
              <div className="flex">
                <p className="text-right">{username}</p>
                <p className="text-gray-500 dark:text-gray-400 pl-2">
                  <a
                    href="#"
                    className="text-sm text-gray-600 no-underline dark:text-gray-500 hover:no-underline"
                    onClick={async () => {
                      const { error } = await supabase.auth.signOut();
                      if (error)
                        console.log("Error logging out:", error.message);
                    }}
                  >
                    logout
                  </a>
                </p>
              </div>
            ) : null}
          </nav>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,auto))] grid-rows-[repeat(auto-fit,minmax(auto,auto))] gap-2">
            <div className="">
              {!session ? (
                <div className="min-w-full h-full flex items-center justify-center">
                  <div className="w-full h-full flex justify-center items-center p-4">
                    <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                      <h1 className="font-sans text-3xl text-center pb-2 mb-1 border-b mx-4 align-center">
                        Prompt Injection Game
                      </h1>
                      <span className="font-sans text-sm text-center pb-2 mb-1 border-b mx-4 align-center">
                        20 attempts, 3 levels. Trick the AI model to give you
                        the secret code to pass.
                      </span>

                      <Auth
                        supabaseClient={supabase}
                        appearance={{
                          theme: ThemeSupa,
                          variables: {
                            default: {
                              colors: {
                                brand: "black",
                                brandAccent: "black",
                                defaultButtonBackground: "#000",
                                defaultButtonBackgroundHover: "#000",
                              },
                            },
                          },
                        }}
                        theme="default"
                        providers={["google"]}
                        onlyThirdPartyProviders={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <Game session={session} />
                  <footer className="w-full pt-4 text-xs">
                    <div className="text-left">
                      <p>
                        <span className="pr-2">&copy;</span>
                        <a
                          href="https://github.com/woop"
                          target="_blank"
                          className="hover:underline"
                        >
                          Willem Pienar
                        </a>
                        ,
                        <a
                          href="https://github.com/shrumm"
                          target="_blank"
                          className="hover:underline"
                        >
                          Shahram Anver
                        </a>
                        ,
                        <a
                          href="https://github.com/zhilingc"
                          target="_blank"
                          className="hover:underline"
                        >
                          Chen Zhiling
                        </a>
                      </p>
                    </div>
                  </footer>
                </div>
              )}
            </div>
            <div className="">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
