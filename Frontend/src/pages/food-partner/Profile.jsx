import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

/* Avatar lives outside the component so it isn't redefined on every render */
const Avatar = ({ name }) => {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative shrink-0">
      {/* soft glow ring */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 blur-md opacity-60" />
      <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-2xl font-bold text-black ring-2 ring-white/20">
        {initials || "?"}
      </div>
    </div>
  );
};

/* Tile that plays its video on hover and pauses/rewinds on leave */
const VideoTile = ({ src }) => {
  const ref = useRef(null);

  const play = () => {
    const v = ref.current;
    if (v) v.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* gradient + play icon, fades out on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-0" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm ring-1 ring-white/20">
          <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px] fill-white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div className="flex-1 text-center">
    <h2 className="text-2xl font-bold tracking-tight text-white">{value ?? 0}</h2>
    <p className="mt-1 text-xs uppercase tracking-wider text-amber-200/60">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/food-partner/${id}`,
          { withCredentials: true },
        );
        setProfile(response.data);
        setVideo(response.data.foodItems || []);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  /* Skeleton loading state */
  if (loading || !profile) {
    return (
      <div className="flex min-h-screen justify-center bg-neutral-950">
        <div className="w-full max-w-md animate-pulse">
          <div className="bg-neutral-900 p-5">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-neutral-800" />
              <div className="flex-1 space-y-3">
                <div className="h-4 w-2/3 rounded bg-neutral-800" />
                <div className="h-4 w-1/3 rounded bg-neutral-800" />
              </div>
            </div>
            <div className="mt-8 flex gap-8">
              <div className="h-10 flex-1 rounded bg-neutral-800" />
              <div className="h-10 flex-1 rounded bg-neutral-800" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl bg-neutral-800" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-neutral-950 text-white">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="relative overflow-hidden px-5 pb-6 pt-7">
          {/* warm ambient glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-orange-600/30 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <Avatar name={profile.fullName || profile.contactName} />

            <div className="min-w-0 flex-1">
              <h1 className="flex items-center gap-1.5 truncate text-xl font-bold">
                {profile.fullName}
                {/* verified-style badge */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-amber-400">
                  <path d="M12 2l2.4 1.8 3 .2.9 2.9 2.1 2.1-1 2.9 1 2.9-2.1 2.1-.9 2.9-3 .2L12 22l-2.4-1.8-3-.2-.9-2.9L3.6 15l1-2.9-1-2.9 2.1-2.1.9-2.9 3-.2L12 2zm-1.2 13.2l5-5-1.4-1.4-3.6 3.6-1.6-1.6-1.4 1.4 3 3z" />
                </svg>
              </h1>
              <p className="truncate text-sm text-amber-200/60">
                @{profile.contactName}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="relative mt-7 flex divide-x divide-white/10 rounded-2xl bg-white/5 py-4 ring-1 ring-white/10">
            <Stat value={profile.totalMeals} label="Total Meals" />
            <Stat value={profile.customersServed} label="Customers" />
          </div>
        </header>

        {/* Section label */}
        <div className="flex items-center gap-2 px-5 pb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
            Dishes
          </h3>
          <span className="text-sm text-white/30">{video.length}</span>
        </div>

        {/* Video grid */}
        {video.length === 0 ? (
          <div className="px-5 py-16 text-center text-white/40">
            <p className="text-sm">No dishes shared yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 px-1.5 pb-6">
            {video.map((food) => (
              <VideoTile key={food._id} src={food.video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;