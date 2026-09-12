'use client';

import { useState } from 'react';
import { toggleLikeAction, toggleCartAction } from '@/app/actions/interactions';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  templateId: string;
  initialLiked?: boolean;
  likeCount?: number;
  className?: string;
}

export function LikeButton({ templateId, initialLiked = false, likeCount = 0, className = '' }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const res = await toggleLikeAction(templateId);

    if (!res.success) {
      router.push('/login');
      return;
    }

    setLiked(res.isLiked ?? false);
    setCount((prev) => (res.isLiked ? prev + 1 : prev - 1));
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
        liked
          ? 'border-rose-200 bg-rose-50 text-rose-600'
          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
      } ${className}`}
    >
      <Heart className={`size-3.5 transition-transform ${liked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
      <span>{count}</span>
    </button>
  );
}

interface CartButtonProps {
  templateId: string;
  initialInCart?: boolean;
  className?: string;
}

export function AddToCartButton({ templateId, initialInCart = false, className = '' }: CartButtonProps) {
  const [inCart, setInCart] = useState(initialInCart);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);

    const res = await toggleCartAction(templateId);

    if (!res.success) {
      router.push('/login');
      return;
    }

    setInCart(res.inCart ?? false);
    setLoading(false);
  };

  return (
    <button
      onClick={handleCart}
      disabled={loading}
      type="button"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-sm font-bold transition ${
        inCart
          ? 'border border-lime-400/50 bg-lime-300/10 text-lime-300 hover:bg-lime-300/20'
          : 'border border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950'
      } ${className}`}
    >
      {inCart ? <Check className="size-4 text-lime-300" /> : <ShoppingBag className="size-4" />}
      <span>{inCart ? 'Tersimpan di Koleksi' : 'Tambah ke Koleksi'}</span>
    </button>
  );
}