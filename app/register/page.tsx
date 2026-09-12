'use client';

import { useState } from 'react';
import { ZxcvbnFactory } from '@zxcvbn-ts/core';
import * as commonPackage from '@zxcvbn-ts/language-common';
import * as englishPackage from '@zxcvbn-ts/language-en';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const passwordChecker = new ZxcvbnFactory({
  dictionary: {
    ...commonPackage.dictionary,
    ...englishPackage.dictionary,
  },
  graphs: commonPackage.adjacencyGraphs,
  translations: englishPackage.translations,
});

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // Evaluasi kekuatan password (skala 0 - 4)
  const passwordScore = password ? passwordChecker.check(password).score : 0;
  const strengthLabels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(`Gagal mendaftar: ${error.message}`);
    } else {
      setMessage('Pendaftaran berhasil! Silakan periksa inbox email kamu untuk verifikasi.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white border rounded-2xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Buat Akun Baru</h1>
      <p className="text-gray-500 text-sm mb-6">Daftar untuk mulai membeli dan menyukai template.</p>

      {message && (
        <div className="mb-4 p-3 text-sm bg-blue-50 text-blue-700 rounded-lg">
          {message}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Kata Sandi</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Visual Password Strength Bar */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                {[0, 1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all ${
                      step <= passwordScore ? strengthColors[passwordScore] : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Kekuatan kata sandi: <span className="font-semibold">{strengthLabels[passwordScore]}</span>
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
        >
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Sudah punya akun?{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}