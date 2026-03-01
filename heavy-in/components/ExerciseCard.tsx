interface ExerciseData {
  name: string;
  note?: string;
  sets?: number | string;
}

interface ExerciseCardProps {
  index: number;
  data: ExerciseData;
}

const ExerciseCard = ({ index, data }: ExerciseCardProps) => {
  return (
    <div className="group flex justify-between items-center p-5 bg-heavy-card rounded-3xl border border-heavy-border hover:border-heavy-teal/40 transition-all duration-500">
      <div className="flex gap-5 items-center">
        <span className="text-heavy-border font-black text-3xl italic group-hover:text-heavy-teal/20 transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="font-black uppercase italic text-heavy-main text-xl leading-none">
            {data.name}
          </h3>
          {data.note && (
            <p className="text-heavy-muted text-xs mt-1.5 font-medium tracking-wide">
              {data.note}
            </p>
          )}
        </div>
      </div>
      {data.sets && (
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-heavy-main leading-none">
            {data.sets}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-heavy-teal mt-1">
            Sets
          </span>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
