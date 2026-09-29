'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { RequestType, District } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  MapPin, 
  Camera, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Upload, 
  Navigation,
  Mic,
  Lightbulb,
  UserCheck,
  ShieldCheck,
  Phone,
  User
} from 'lucide-react';

function CreateRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isGuest, registerCitizen, t, lang } = useApp();

  // Mode: problem vs idea
  const [requestType, setRequestType] = useState<RequestType>(
    searchParams.get('type') === 'idea' ? 'idea' : 'problem'
  );

  // Form Fields
  const [originalText, setOriginalText] = useState('');
  const [address, setAddress] = useState('г. Семей, пр. Шакарима, 45');
  const [latitude, setLatitude] = useState(50.4082);
  const [longitude, setLongitude] = useState(80.2589);
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Guest Registration inline state (if user is in guest mode)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestDistrict, setGuestDistrict] = useState<District>('Центральный');

  // Voice Input State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Word count (limit 200 words)
  const wordCount = originalText.trim() ? originalText.trim().split(/\s+/).length : 0;
  const isWordCountExceeded = wordCount > 200;

  // Simulate GPS location detection in Semey
  const handleSimulateGPS = () => {
    setAddress('г. Семей, ул. Мухтара Ауэзова, 12');
    setLatitude(50.4111);
    setLongitude(80.2458);
  };

  // Voice recording / Speech recognition
  const handleToggleVoice = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoiceNotice('');
      return;
    }

    interface SpeechEvent {
      results: Array<Array<{ transcript: string }>>;
    }
    interface SpeechRecInstance {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: () => void;
      onresult: (ev: SpeechEvent) => void;
      onerror: () => void;
      start: () => void;
    }
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecInstance;
      webkitSpeechRecognition?: new () => SpeechRecInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = lang === 'kz' ? 'kk-KZ' : lang === 'en' ? 'en-US' : 'ru-RU';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setVoiceNotice(lang === 'kz' ? 'Тыңдап тұрмыз... Микрофонға айтыңыз' : 'Слушаем... Говорите в микрофон');
        };

        recognition.onresult = (event: SpeechEvent) => {
          const transcript = event.results[0][0].transcript;
          setOriginalText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
          setVoiceNotice(lang === 'kz' ? 'Мәтін танылды!' : 'Текст распознан!');
          setTimeout(() => setVoiceNotice(''), 3000);
        };

        recognition.onerror = () => {
          simulateDictation();
        };

        recognition.start();
        return;
      } catch {
        simulateDictation();
      }
    } else {
      simulateDictation();
    }
  };

  const simulateDictation = () => {
    setIsRecording(true);
    setVoiceNotice(lang === 'kz' ? 'Дауыс жазылуда...' : 'Идет запись голоса...');
    setTimeout(() => {
      const sample = requestType === 'problem'
        ? (lang === 'kz' ? 'Шәкәрім даңғылындағы жолда үлкен шұңқыр пайда болды, көліктерге қауіп төндіруде.' : 'На проспекте Шакарима на проезжей части глубокая яма, заделайте пожалуйста асфальт.')
        : (lang === 'kz' ? 'Ертіс жағалауына қосымша жарық шамдары мен орындықтар орнатуды ұсынамын.' : 'Предлагаю установить дополнительные теплые остановки и фонари в Затоне.');
      setOriginalText((prev) => (prev ? `${prev} ${sample}` : sample));
      setIsRecording(false);
      setVoiceNotice(lang === 'kz' ? 'Дауыстық хабарлама қабылданды' : 'Голосовое сообщение распознано');
      setTimeout(() => setVoiceNotice(''), 3000);
    }, 1800);
  };

  // Submit Handler: Silent AI Processing & Immediate Creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalText.trim()) {
      setErrorMessage(lang === 'kz' ? 'Өтініш мәтінін енгізіңіз' : lang === 'en' ? 'Please enter description' : 'Пожалуйста, опишите обращение перед отправкой.');
      return;
    }

    if (isWordCountExceeded) {
      setErrorMessage(lang === 'kz' ? 'Мәтін 200 сөзден аспауы керек' : 'Текст обращения превышает лимит в 200 слов.');
      return;
    }

    if (!address.trim()) {
      setErrorMessage(lang === 'kz' ? 'Мекенжайды көрсетіңіз' : 'Пожалуйста, укажите адрес в городе Семей.');
      return;
    }

    // If resident is guest, require basic contact info
    if (isGuest && !user?.phone) {
      if (!guestName.trim()) {
        setErrorMessage(lang === 'kz' ? 'Өтінімді тіркеу үшін аты-жөніңізді енгізіңіз' : 'Для регистрации обращения укажите ваше имя.');
        return;
      }
      if (!guestPhone.trim()) {
        setErrorMessage(lang === 'kz' ? 'Байланыс телефонын енгізіңіз' : 'Укажите номер телефона, чтобы службы могли связаться с вами.');
        return;
      }
      // Register citizen in state
      registerCitizen({
        name: guestName,
        phone: guestPhone,
        email: 'resident@semey.kz',
        district: guestDistrict
      });
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // 1. Silent AI Analysis in background
      const aiResponse = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          location: address
        })
      });

      const aiData = await aiResponse.json();
      const aiResult = aiData?.data;

      // 2. Direct ticket creation in registry
      const newTicketPayload = {
        type: requestType,
        title: aiResult?.title || (originalText.length > 50 ? `${originalText.slice(0, 50)}...` : originalText),
        original_text: originalText,
        cleaned_text: aiResult?.cleaned_text || originalText,
        category: aiResult?.category || (requestType === 'idea' ? 'Благоустройство' : 'Дороги'),
        department: aiResult?.department || 'ЖКХ',
        priority: aiResult?.priority || 'medium',
        location_address: address,
        location_lat: latitude,
        location_lng: longitude,
        photo_url: photoUrl,
        author_name: isAnonymous ? (lang === 'kz' ? 'Анонимді тұрғын' : 'Анонимный житель') : (guestName || user?.name || 'Житель г. Семей'),
        author_phone: guestPhone || user?.phone || '+7 (705) 412-88-99',
        author_email: user?.email || 'resident@semey.kz',
        is_anonymous: isAnonymous,
        district: guestDistrict || user?.district || 'Центральный'
      };

      const createResponse = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicketPayload)
      });

      const createData = await createResponse.json();

      if (createData.success && createData.data?.id) {
        // Redirect directly to the created request page
        router.push(`/requests/${createData.data.id}?created=true`);
      } else {
        throw new Error(createData.error || 'Ошибка при сохранении заявки');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(lang === 'kz' ? 'Өтінімді жіберу кезінде қате орын алды. Қайталап көріңіз.' : 'Произошла ошибка при отправке обращения. Пожалуйста, попробуйте еще раз.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-extrabold rounded-full bg-slate-900 text-white mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Smart Qala • Семей</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {requestType === 'idea' ? t.createTitleIdea : t.createTitleProblem}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium">
          {t.createSubtitle}
        </p>
      </div>

      {/* Main Submission Card */}
      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-md p-6 sm:p-8">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-2 border-red-300 text-red-900 text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Request Type Selector: Problem vs Idea */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
              Тип обращения
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestType('problem')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  requestType === 'problem'
                    ? 'bg-red-50 border-red-600 text-red-900 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span>{t.createTypeProblem}</span>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('idea')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  requestType === 'idea'
                    ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>{t.createTypeIdea}</span>
              </button>
            </div>
          </div>

          {/* 2. Text Description with Word Counter & Voice Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {requestType === 'idea' ? t.createTextLabelIdea : t.createTextLabelProblem}
              </label>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
                }`}
                title="Голосовой ввод сообщения"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Идет запись...' : 'Голосовой ввод'}</span>
              </button>
            </div>

            {voiceNotice && (
              <div className="mb-2 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-200">
                {voiceNotice}
              </div>
            )}

            <div className="relative">
              <textarea
                rows={5}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder={t.createTextPlaceholder}
                className={`w-full p-4 rounded-lg border-2 text-base text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  isWordCountExceeded ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-slate-900 bg-white'
                }`}
              />

              <div className="flex items-center justify-between mt-1 text-xs font-mono">
                <span className="text-slate-600 font-sans">
                  ИИ автоматически сформулирует официальный запрос
                </span>
                <span className={`font-bold ${isWordCountExceeded ? 'text-red-600' : 'text-slate-700'}`}>
                  {wordCount} / 200 слов
                </span>
              </div>
            </div>
          </div>

          {/* 3. Address & Location with GPS button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {t.createAddressLabel}
              </label>

              <button
                type="button"
                onClick={handleSimulateGPS}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900 hover:underline cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                <span>{t.createGpsBtn}</span>
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.createAddressPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-slate-300 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>
          </div>

          {/* 4. Photo Attachment */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-2">
              {t.createPhotoLabel}
            </label>

            {photoUrl ? (
              <div className="flex items-center gap-4 p-3 bg-slate-50 border-2 border-slate-200 rounded-lg">
                <div 
                  className="w-20 h-20 rounded-md bg-cover bg-center shrink-0 border border-slate-300"
                  style={{ backgroundImage: `url('${photoUrl}')` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">Фото инцидента прикреплено</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Будет передано инспектору ЖКХ</div>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-xs text-red-600 hover:underline font-bold mt-1.5 cursor-pointer block"
                  >
                    Удалить фото
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80')}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-lg text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Выбрать фото с камеры</div>
                    <div className="text-[11px] text-slate-600">Нажмите для образца</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80')}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-lg text-left flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-slate-700 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Загрузить файл</div>
                    <div className="text-[11px] text-slate-600">JPG, PNG до 15 МБ</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. Guest Contact Prompt (if user is guest) */}
          {isGuest && (
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-800" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                  Контактные данные заявителя
                </span>
              </div>
              <p className="text-xs text-blue-950 leading-relaxed font-medium">
                По регламенту города Семей, для регистрации официального обращения укажите имя и телефон для обратной связи служб.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Айгүл Ахметова"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+7 (705) 000-00-00"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. Anonymous Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
            />
            <label htmlFor="anonymous" className="text-xs text-slate-800 font-medium cursor-pointer">
              <span className="font-bold">{t.createAnonymousLabel}</span> — {t.createAnonymousHint}
            </label>
          </div>

          {/* 7. Submit Action Button (1-Click with Silent AI Processing) */}
          <div className="pt-4 border-t-2 border-slate-200">
            <button
              type="submit"
              disabled={isSubmitting || isWordCountExceeded}
              className={`w-full py-4 px-6 rounded-lg font-bold text-base text-white flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer ${
                isSubmitting 
                  ? 'bg-slate-700 cursor-not-allowed' 
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span>{t.createSubmitting}</span>
                </>
              ) : (
                <>
                  <span>{t.createSubmitBtn}</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </>
              )}
            </button>
            <p className="text-xs text-slate-600 text-center mt-2 font-medium">
              ИИ структурирует текст, определит службу и назначит приоритет автоматически
            </p>
          </div>

        </form>
      </div>

    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
          </div>
        }>
          <CreateRequestContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
