import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExerciseData {
  name: string;
  note?: string;
  sets?: number | string;
  reps?: number | string;
}

interface ExerciseCardProps {
  index: number;
  data: ExerciseData;
}

const ExerciseCard = ({ index, data }: ExerciseCardProps) => {
  return (
    <Card className="group hover:border-primary/40 transition-all duration-300">
      <CardContent className="flex justify-between items-center px-5">
        <div className="flex gap-4 items-center">
          <span className="text-muted-foreground/25 font-black text-2xl italic w-8 group-hover:text-primary/20 transition-colors">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-semibold text-foreground text-base leading-none">
              {data.name}
            </h3>
            {data.note && (
              <p className="text-muted-foreground text-xs mt-1.5 tracking-wide">
                {data.note}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {data.sets && (
            <div
              className={`flex flex-col items-end ${data.reps ? "pr-4 border-r" : ""}`}
            >
              <span className="text-lg font-bold leading-none">
                {data.sets}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                Sets
              </span>
            </div>
          )}
          {data.reps && (
            <div className="flex flex-col items-end min-w-7">
              <span className="text-lg font-bold leading-none">
                {data.reps}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                Reps
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
