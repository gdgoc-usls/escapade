import { useEffect, useState } from "react";
import starsBg from "../assets/strrrs.png";
import stopwatchIcon from "../assets/stopwatch.png";
import { ScrollReveal } from "../components/ScrollReveal";
import { useParallaxBg } from "../hooks/useParallaxBg";
import { getCrews } from "../controllers/crewController";
import type { CrewWithEscapeTime } from "../models/crewModel";

const formatTime = (totalSeconds: number | null) => {
 if (totalSeconds === null) {
      return '—'
    }

    const minutes = Math.floor(totalSeconds / 60000)

    const seconds = Math.floor(
      (totalSeconds % 60000) / 1000
    )

    const milliseconds = Math.floor(
      (totalSeconds % 1000) / 10
    )

    return `${minutes}m ${String(seconds).padStart(2, '0')}s ${String(milliseconds).padStart(2, '0')}ms`
};

export function LeaderboardSection() {
  const [leaderboardData, setLeaderboardData] = useState<CrewWithEscapeTime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getCrews();
        
        const validCrews = data
          .filter((crew) => crew.escape_time !== null)
          .sort((a, b) => (a.escape_time as number) - (b.escape_time as number));
          
        setLeaderboardData(validCrews);
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const rankStyles = [
    { 
      rank: "1st", 
      textClass: "text-[#FEFA09]",
      iconClass: "bg-[#FEFA09]", 
      paddingClass: "py-3 sm:py-5", 
      rankSize: "text-xl sm:text-5xl",
      crewSize: "text-sm sm:text-4xl",
      timeSize: "text-[11px] sm:text-2xl",
      iconSize: "w-3.5 h-3.5 sm:w-8 sm:h-8",
      rowStyle: {
        backgroundColor: "rgba(254, 250, 9, 0.2)", 
        borderColor: "#FEFA09",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0px 0px 20px 0px rgba(254, 250, 9, 0.3)",
      }
    },
    { 
      rank: "2nd", 
      textClass: "text-white",
      iconClass: "bg-white", 
      paddingClass: "py-2.5 sm:py-4", 
      rankSize: "text-lg sm:text-4xl",
      crewSize: "text-xs sm:text-3xl",
      timeSize: "text-[10px] sm:text-xl",
      iconSize: "w-3 h-3 sm:w-7 sm:h-7",
      rowStyle: {
        backgroundColor: "rgba(177, 179, 181, 0.3)", 
        borderColor: "#A0A0A0",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0px 0px 20px 0px rgba(160, 160, 160, 0.3)",
      }
    },
    { 
      rank: "3rd", 
      textClass: "text-[#CD7F32]",
      iconClass: "bg-[#CD7F32]", 
      paddingClass: "py-2 sm:py-3.5", 
      rankSize: "text-base sm:text-3xl",
      crewSize: "text-[11px] sm:text-2xl",
      timeSize: "text-[9px] sm:text-lg",
      iconSize: "w-2.5 h-2.5 sm:w-6 sm:h-6",
      rowStyle: {
        backgroundColor: "rgba(205, 127, 50, 0.2)", 
        borderColor: "#9E7B4F",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0px 0px 20px 0px rgba(205, 127, 50, 0.3)",
      }
    },
    { 
      rank: "4th", 
      textClass: "text-[#CEDFFB]",
      iconClass: "bg-[#CEDFFB]", 
      paddingClass: "py-2 sm:py-3", 
      rankSize: "text-sm sm:text-2xl",
      crewSize: "text-[10px] sm:text-xl",
      timeSize: "text-[8px] sm:text-base",
      iconSize: "w-2.5 h-2.5 sm:w-5 sm:h-5",
      rowStyle: {
        backgroundColor: "rgba(7, 20, 102, 0.2)", 
        borderColor: "rgba(7, 20, 102, 0.5)",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0px 0px 15px 0px rgba(7, 20, 102, 0.4)",
      }
    },
    { 
      rank: "5th", 
      textClass: "text-[#CEDFFB]",
      iconClass: "bg-[#CEDFFB]", 
      paddingClass: "py-2 sm:py-3", 
      rankSize: "text-sm sm:text-2xl",
      crewSize: "text-[10px] sm:text-xl",
      timeSize: "text-[8px] sm:text-base",
      iconSize: "w-2.5 h-2.5 sm:w-5 sm:h-5",
      rowStyle: {
        backgroundColor: "rgba(7, 20, 102, 0.2)", 
        borderColor: "rgba(7, 20, 102, 0.5)",
        borderWidth: "1px",
        borderStyle: "solid",
        boxShadow: "0px 0px 15px 0px rgba(7, 20, 102, 0.4)",
      }
    },
  ];

  const displayRankings = rankStyles.map((style, index) => {
    const crew = leaderboardData[index];
    return {
      ...style,
      team: crew ? crew.crew_name : "---",
      time: crew ? formatTime(crew.escape_time) : "--:--:--",
    };
  });

  const sectionRef = useParallaxBg<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="leaderboard"
      style={{ backgroundImage: `url(${starsBg})` }}
      className="relative min-h-screen flex flex-col items-center py-24 sm:py-32 px-3 sm:px-8 border-t border-white/10 text-white bg-cover bg-center bg-no-repeat leaderboard-section"
    >
      <style>{`
        @media (min-width: 768px) {
          .leaderboard-section { background-attachment: fixed; }
        }
      `}</style>

      {/* Dark overlay between bg and content */}
      <div className="absolute inset-0 bg-[rgba(5,8,6,0.20)] pointer-events-none z-0" aria-hidden="true" />

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-extrabold text-white uppercase tracking-widest mb-12 text-center">
            MISSION RANKINGS
          </h2>
        </ScrollReveal>

        <ScrollReveal delay="100ms" className="w-full">
          <div className="w-full flex flex-col gap-3 sm:gap-4">
            
            {/* Table Headers */}
            <div className="flex items-center justify-between px-4 sm:px-10 pb-2 text-[10px] sm:text-2xl font-orbitron font-bold text-white uppercase tracking-wider">
              <div className="flex items-center gap-2 sm:gap-8 flex-1 min-w-0">
                <span className="w-10 sm:w-24 text-center sm:text-left">RANK</span>
                {/* Stacked header for mobile to save space */}
                <span className="text-center sm:text-left leading-tight sm:leading-normal">
                  CREW<br className="block sm:hidden" /> NAME
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                <div 
                  className="w-3 h-3 sm:w-8 sm:h-8 bg-white [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]" 
                  style={{ 
                    WebkitMaskImage: `url(${stopwatchIcon})`, 
                    maskImage: `url(${stopwatchIcon})` 
                  }} 
                />
                <span>TIME</span>
              </div>
            </div>

            {/* Leaderboard Rows */}
            {loading ? (
              <div className="text-center py-10 font-orbitron text-2xl text-white/50">
                LOADING RANKS...
              </div>
            ) : (
              displayRankings.map((item, index) => (
                <ScrollReveal key={index} delay={`${150 + index * 80}ms`}>
                  <div
                    style={item.rowStyle}
                    className={`flex items-center justify-between px-4 sm:px-10 gap-2 sm:gap-4 ${item.paddingClass} rounded-2xl sm:rounded-3xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:brightness-110 cursor-default`}
                  >
                    {/* Left Side: Rank & Crew Name */}
                    <div className="flex items-center gap-2 sm:gap-8 flex-1 min-w-0">
                      <span className={`w-10 sm:w-24 text-center sm:text-left font-orbitron font-bold flex-shrink-0 ${item.rankSize} ${item.textClass}`}>
                        {item.rank}
                      </span>
                      {/* line-clamp-2 ensures long names safely wrap to 2 lines without pushing the time out */}
                      <span className={`font-orbitron font-medium tracking-wide break-words line-clamp-2 ${item.crewSize} ${item.textClass}`}>
                        {item.team}
                      </span>
                    </div>
                    
                    {/* Right Side: Time */}
                    <div className={`flex items-center gap-1 sm:gap-3 flex-shrink-0 font-orbitron font-medium tracking-wide ${item.timeSize} ${item.textClass}`}>
                      <div 
                        className={`${item.iconSize} ${item.iconClass} [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center]`}
                        style={{ 
                          WebkitMaskImage: `url(${stopwatchIcon})`, 
                          maskImage: `url(${stopwatchIcon})` 
                        }} 
                      />
                      {item.time}
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}