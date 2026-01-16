
import React, { useState, useEffect } from 'react';
import { VideoInfo, HistoryItem, QualityOption } from './types';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [activeDownload, setActiveDownload] = useState<QualityOption | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vidtik_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl || (!cleanUrl.includes('tiktok.com') && !cleanUrl.includes('vm.tiktok'))) {
      setError('Por favor, insira um link válido do TikTok.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Simulação de extração de dados (Em produção, aqui você conectaria com sua API)
    setTimeout(() => {
      const mockData: VideoInfo = {
        title: "Conteúdo TikTok Viral #" + Math.floor(Math.random() * 1000),
        creator: "user_" + Math.random().toString(36).substring(7),
        duration: "00:30",
        thumbnail: `https://picsum.photos/seed/${Math.random()}/400/700`,
        qualities: [
          { id: '1080', label: 'Vídeo MP4', resolution: '1080p (Full HD)', size: '15.2 MB' },
          { id: '720', label: 'Vídeo MP4', resolution: '720p (HD)', size: '8.4 MB' },
          { id: '480', label: 'Vídeo MP4', resolution: '480p (SD)', size: '4.1 MB' },
          { id: 'mp3', label: 'Apenas Áudio', resolution: 'MP3 (320kbps)', size: '1.2 MB', isAudio: true }
        ]
      };

      setResult(mockData);
      
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        url: cleanUrl,
        timestamp: Date.now(),
        data: mockData
      };
      
      const newHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(newHistory);
      localStorage.setItem('vidtik_history', JSON.stringify(newHistory));
      setIsProcessing(false);
    }, 1500);
  };

  const startDownload = (quality: QualityOption) => {
    setActiveDownload(quality);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setActiveDownload(null);
            alert(`Sucesso! O arquivo ${quality.isAudio ? 'MP3' : 'MP4'} (${quality.resolution}) foi salvo.`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleReset = () => {
    setResult(null);
    setUrl('');
    setError(null);
    setActiveDownload(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-cyan-500/30">
      {/* Header */}
      <nav className="w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-50 bg-[#0f172a]/80">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-pink-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-cyan-500/20">
            V
          </div>
          <span className="text-2xl font-black tracking-tighter">VIDTIK</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-slate-400 font-medium">
          <a href="#" className="hover:text-cyan-400 transition-colors">MP4 HD</a>
          <a href="#" className="hover:text-pink-500 transition-colors">MP3 Áudio</a>
          <a href="#" className="hover:text-white transition-colors underline decoration-cyan-500">App</a>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex">Suporte</Button>
      </nav>

      <main className="w-full max-w-4xl px-6 py-12 md:py-20 flex flex-col items-center">
        {/* State: Initial Search */}
        {!result && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                Tudo do TikTok <br />
                <span className="gradient-text">Sem Marca d'Água</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Baixe vídeos em 1080p, 720p ou converta para MP3 instantaneamente. Grátis, rápido e ilimitado.
              </p>
            </div>

            <form onSubmit={handleProcess} className="w-full relative mb-16">
              <div className="glass p-2 rounded-[2rem] flex flex-col md:flex-row gap-2 transition-all hover:shadow-2xl hover:shadow-cyan-500/10 focus-within:border-cyan-500/40 border-2 border-transparent">
                <input 
                  type="text" 
                  placeholder="Cole o link do vídeo aqui..." 
                  className="flex-1 bg-transparent px-6 py-5 outline-none text-white placeholder:text-slate-500 text-lg font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  isLoading={isProcessing}
                  className="md:w-52 h-[60px] text-lg rounded-2xl shadow-xl"
                >
                  Analisar Link
                </Button>
              </div>
              {error && <p className="text-red-400 mt-4 text-center font-semibold bg-red-400/10 py-2 rounded-lg">{error}</p>}
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
              <FeatureCard 
                title="Qualidade HD" 
                desc="Preserve cada detalhe do vídeo original em até 4K."
                icon="💎"
              />
              <FeatureCard 
                title="Conversor MP3" 
                desc="Extraia o áudio de alta qualidade com um clique."
                icon="🎵"
              />
              <FeatureCard 
                title="100% Seguro" 
                desc="Não salvamos seus dados, apenas processamos o link."
                icon="🔒"
              />
            </div>
          </div>
        )}

        {/* State: Result & Download Options */}
        {result && (
          <div className="w-full animate-in zoom-in-95 fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
               <div>
                 <h2 className="text-3xl font-bold">Resultado da busca</h2>
                 <p className="text-slate-400">Escolha o formato desejado abaixo</p>
               </div>
               <button 
                onClick={handleReset}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700"
               >
                 <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                 Baixar Novo Vídeo
               </button>
            </div>

            <div className="glass rounded-[2.5rem] p-6 md:p-10 border-cyan-500/20 shadow-2xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Preview Thumbnail */}
                <div className="w-full md:w-64 shrink-0">
                  <div className="aspect-[9/16] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 relative group">
                    <img 
                      src={result.thumbnail} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt="Thumbnail"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <span className="text-white text-sm font-bold">Duração: {result.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Qualities & Actions */}
                <div className="flex-1">
                  <div className="mb-8">
                    <h3 className="text-2xl font-black mb-2 text-white">{result.title}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-bold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      @{result.creator}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeDownload ? (
                      <div className="p-8 bg-slate-900/50 rounded-3xl border border-white/5 animate-pulse">
                        <div className="flex justify-between items-end mb-4">
                           <p className="text-slate-300 font-bold">Preparando seu arquivo...</p>
                           <p className="text-cyan-400 font-black text-2xl">{downloadProgress}%</p>
                        </div>
                        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-cyan-400 bg-[length:200%_100%] animate-[gradient_2s_linear_infinite] transition-all duration-300"
                            style={{ width: `${downloadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-4 text-center italic">Isso pode levar alguns segundos dependendo da conexão.</p>
                      </div>
                    ) : (
                      result.qualities.map((q) => (
                        <div 
                          key={q.id}
                          className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group"
                          onClick={() => startDownload(q)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${q.isAudio ? 'bg-pink-500/20 text-pink-400' : 'bg-cyan-500/20 text-cyan-400'} group-hover:scale-110 transition-transform`}>
                              {q.isAudio ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-lg">{q.label}</p>
                              <span className="text-xs font-mono text-slate-500 uppercase">{q.resolution}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <span className="hidden sm:inline-block px-2 py-1 bg-slate-900 rounded-md text-[10px] font-bold text-slate-400 border border-slate-800">{q.size}</span>
                             <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                             </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full mt-24">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black italic tracking-tighter">ÚLTIMOS DOWNLOADS</h3>
               <button 
                onClick={() => { localStorage.removeItem('vidtik_history'); setHistory([]); }}
                className="text-xs text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors"
               >
                 Limpar Tudo
               </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.map(item => (
                <div 
                  key={item.id} 
                  className="glass rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-400/50 transition-all hover:-translate-y-1 group"
                  onClick={() => {
                    setResult(item.data);
                    setUrl(item.url);
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                >
                  <div className="aspect-[3/4] bg-slate-800 overflow-hidden relative">
                    <img 
                      src={item.data.thumbnail} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      alt="Preview"
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                      <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-black">{item.data.duration}</span>
                      <span className="text-[10px] bg-cyan-500 px-1.5 py-0.5 rounded font-black text-white shadow-lg">HD</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/40">
                    <p className="text-[10px] text-cyan-400 font-black mb-1 truncate">@{item.data.creator}</p>
                    <p className="text-[11px] text-slate-400 truncate font-medium">{item.data.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="w-full max-w-7xl px-6 py-12 mt-auto border-t border-slate-800 text-slate-500 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center font-bold text-white text-[10px]">V</div>
            <span className="font-black text-sm tracking-tighter text-slate-300">VIDTIK © 2024</span>
          </div>
          <p className="text-xs">Sua ferramenta definitiva para mídias sociais.</p>
        </div>
        
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-400 transition-colors">Termos</a>
          <a href="#" className="hover:text-pink-500 transition-colors">API</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
        </div>

        <div className="text-[10px] max-w-xs leading-relaxed opacity-50">
          O VidTik não é afiliado ao TikTok ou ByteDance. Respeite os direitos autorais dos criadores.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="glass p-6 rounded-2xl border-white/5 hover:border-white/10 transition-all flex flex-col items-center text-center">
    <div className="text-3xl mb-4">{icon}</div>
    <h4 className="font-bold text-white mb-2">{title}</h4>
    <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;
