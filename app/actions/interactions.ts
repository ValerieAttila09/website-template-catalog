'use me';
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Toggle Like Template
export async function toggleLikeAction(templateId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Anda harus login terlebih dahulu.' };
  }

  // Cek apakah user sudah menyukai template ini
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('template_id', templateId)
    .maybeSingle();

  if (existingLike) {
    // Hapus like (Unlike)
    await supabase.from('likes').delete().eq('id', existingLike.id);
  } else {
    // Tambah like
    await supabase.from('likes').insert({
      user_id: user.id,
      template_id: templateId,
    });
  }

  revalidatePath('/catalog');
  revalidatePath(`/template/${templateId}`);
  return { success: true, isLiked: !existingLike };
}

// Toggle Add to Cart / Collection
export async function toggleCartAction(templateId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Anda harus login terlebih dahulu.' };
  }

  const { data: existingCartItem } = await supabase
    .from('cart_items')
    .select('id')
    .eq('user_id', user.id)
    .eq('template_id', templateId)
    .maybeSingle();

  if (existingCartItem) {
    await supabase.from('cart_items').delete().eq('id', existingCartItem.id);
  } else {
    await supabase.from('cart_items').insert({
      user_id: user.id,
      template_id: templateId,
    });
  }

  revalidatePath('/catalog');
  return { success: true, inCart: !existingCartItem };
}