import { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  Store,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import Profile from "../food-partner/Profile";
import { useNavigate } from "react-router-dom";
/**
 * Home.jsx
 * A full-screen, vertically-scrolling Reels feed (TikTok / Instagram style).
 * - Fetches data via GET http://localhost:3000/api/food/
 * - Each document: { _id, name, description, video }
 * - One video covers the entire screen at a time
 * - CSS scroll-snap so each swipe locks a video to fill the viewport
 * - Active video autoplays (muted), others pause (IntersectionObserver)
 * - Each video has a "Visit Store" button at the bottom
 * - A description sits above the button, truncated to a max of 2 lines
 */

const API_URL = "http://localhost:3000/api/food/";

const ACCENTS = [
  "from-amber-400 to-orange-500",
  "from-violet-400 to-fuchsia-500",
  "from-rose-500 to-red-600",
  "from-sky-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-pink-400 to-rose-500",
  "from-indigo-400 to-blue-500",
  "from-lime-400 to-green-500",
];

function Avatar({ name, accent }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br ${accent} text-sm font-bold text-white ring-2 ring-white/80`}
    >
      {initials}
    </div>
  );
}

function ActionButton({ icon: Icon, label, active, onClick, fill }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 outline-none"
    >
      <span className="grid h-11 w-11 place-items-center rounded-full bg-black/25 backdrop-blur-sm transition active:scale-90">
        <Icon
          className={`h-6 w-6 drop-shadow transition ${
            active ? "text-rose-500" : "text-white"
          }`}
          fill={active && fill ? "currentColor" : "none"}
          strokeWidth={1.8}
        />
      </span>
      <span className="text-[11px] font-semibold text-white drop-shadow">
        {label}
      </span>
    </button>
  );
}

function Reel({ item, isActive, muted, onToggleMute }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
// Play when this reel is the active one in view, pause otherwise.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play()
        .then(() => setPaused(false))
        .catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
      setExpanded(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }, []);

  return (
    <section className="relative h-full w-full snap-start snap-always overflow-hidden bg-black">
      {/* Video fills the entire screen */}
      <video
        ref={videoRef}
        src={item.video}
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {/* Tap target + play indicator overlay */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 z-10 grid place-items-center outline-none"
        aria-label="Play / pause"
      >
        {paused && (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-black/35 backdrop-blur-sm">
            <Play className="h-9 w-9 text-white" fill="currentColor" />
          </span>
        )}
      </button>

      {/* Gradient scrim so text stays legible on any footage */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2/5 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Mute / unmute */}
      <button
        onClick={onToggleMute}
        className="absolute right-4 top-4 z-40 grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur-sm transition active:scale-90"
        aria-label="Toggle sound"
      >
        {muted ? (
          <VolumeX className="h-5 w-5 text-white" />
        ) : (
          <Volume2 className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Right-side action rail */}
      <div className="absolute bottom-32 right-3 z-40 flex flex-col items-center gap-5">
        <ActionButton
          icon={Heart}
          label="Like"
          active={liked}
          fill
          onClick={() => setLiked((v) => !v)}
        />
        {/* <ActionButton icon={MessageCircle} label="Comment" /> */}
        {/* <ActionButton icon={Send} label="Share" /> */}
        <ActionButton
          icon={Bookmark}
          label="Save"
          active={saved}
          onClick={() => setSaved((v) => !v)}
        />
        {/* <button className="grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur-sm">
          <MoreHorizontal className="h-5 w-5 text-white" />
        </button> */}
      </div>

      {/* Bottom content: store identity, description, then the button */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 pr-20">
        <div className="mb-3 flex items-center gap-3">
          {/* <Avatar name={item.name} accent={item.accent} /> */}
          <div className="leading-tight">
            <p className="text-[20px] font-bold text-white drop-shadow">
              {item.name}
            </p>
          </div>
          
        </div>

        {/* Description — truncated to a maximum of two lines */}
        <p
          onClick={() => setExpanded((v) => !v)}
          className={`mb-4 max-w-md cursor-pointer text-sm leading-snug text-white/95 drop-shadow ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {item.description}
          {!expanded && (
            <span className="ml-1 font-semibold text-white/60">more</span>
          )}
        </p>

        {/* Visit Store button at the very bottom of the video */}
        <Link
          to={`/food-partner/${item.foodPartnerId}`}
          className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-[15px] font-bold text-black shadow-lg transition active:scale-[0.98]"
        >
          <Store className="h-[18px] w-[18px]" strokeWidth={2.2} />
          Visit Store
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch videos from backend
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        });

        const items = data.foods || [];
        const mapped = items.map((item, i) => ({
          _id: item._id,
          foodPartnerId: item.foodPartnerId,
          name: item.name || "Store",
          description: item.description || "",
          video: item.video,
          accent: ACCENTS[i % ACCENTS.length],
        }));

        setFeed(mapped);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
        if (err.response?.status === 401) {
          navigate("/user/login");
          return;
        }
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [navigate]);

  // IntersectionObserver — re-attach after feed loads
  useEffect(() => {
    if (feed.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const idx = Number(entry.target.dataset.index);
            setActiveIndex(idx);
          }
        });
      },
      { root: containerRef.current, threshold: [0.6] },
    );

    reelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [feed]);

  if (loading) {
    return (
      <div className="grid h-screen w-full place-items-center bg-neutral-950">
        <Loader2 className="h-10 w-10 animate-spin text-white/60" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid h-screen w-full place-items-center bg-neutral-950">
        <div className="flex max-w-xs flex-col items-center gap-3 text-center text-white">
          <p className="text-lg font-semibold">Failed to load</p>
          <p className="text-sm text-white/50">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="grid h-screen w-full place-items-center bg-neutral-950">
        <p className="text-sm text-white/50">No videos yet</p>
      </div>
    );
  }

  return (
    <div className="grid h-screen w-full place-items-center bg-neutral-950 font-sans">
      <div className="relative h-full w-full overflow-hidden bg-black sm:h-[92vh] sm:max-w-[430px] sm:rounded-[2rem] sm:shadow-2xl sm:ring-1 sm:ring-white/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-center gap-6 bg-gradient-to-b from-black/50 to-transparent px-4 pb-6 pt-4 text-sm font-semibold text-white">
          {/* <span className="text-white/50">Following</span> */}
          <span className="relative">
            For You
            <span className="absolute -bottom-1.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-white" />
          </span>
        </div>

        <div
          ref={containerRef}
          className="h-full w-full snap-y snap-mandatory overflow-y-scroll scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {feed.map((item, i) => (
            <div
              key={item._id}
              data-index={i}
              ref={(el) => (reelRefs.current[i] = el)}
              className="h-full w-full"
            >
              <Reel
                item={item}
                isActive={i === activeIndex}
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
