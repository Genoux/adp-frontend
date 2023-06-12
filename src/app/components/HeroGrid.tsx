import Image from "next/image";

interface HeroGridProps {
  team?: any;
  color: string;
  useTiles?: boolean;
}

const HeroGrid: React.FC<HeroGridProps> = ({ team, color, useTiles }) => {
  if (!team) return null; // return null when team is null

  return (
    <div
      className={`grid gap-4 grid-flow-col-dense mt-6 ${
        team.isTurn ? `bg-gray-700` : ""
      }`}>
      {team?.heroes_selected.map((hero: any, index: number) => (
        <div key={index} className={`border overflow-hidden ${useTiles ? "w-32 h-32" : "w-38 h-96"}`}>
          {hero.name && (
            <>
              {useTiles ? (
                 <div
                 className="bg-cover bg-center w-32 h-32"
                 style={{
                   backgroundImage: `url('/images/champions/tiles/${hero.name.replace(/\s/g, "").toLowerCase()}.jpg')`,
                 }}
               />
               
              ) : (
                <div
                className="bg-cover bg-center wfull h-full"
                style={{
                  backgroundImage: `url('/images/champions/splash/${hero.name.replace(/\s/g, "").toLowerCase()}.jpg')`,
                }}
              />
              
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default HeroGrid;
