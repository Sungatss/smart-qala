'use client';

import React, { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
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
  User,
  Image as ImageIcon,
  Trash2,
  RefreshCw
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
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [photoFileSize, setPhotoFileSize] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // File Upload Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // Real Device Image Upload
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage(lang === 'kz' ? 'Сурет файлын таңдаңыз (JPG, PNG, WebP)' : 'Пожалуйста, выберите файл изображения (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage(lang === 'kz' ? 'Файл көлемі 15 МБ аспауы керек' : 'Размер файла превышает 15 МБ. Выберите файл меньшего размера.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoUrl(dataUrl);
      setPhotoFileName(file.name);
      setPhotoFileSize((file.size / (1024 * 1024)).toFixed(1) + ' МБ');
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

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
        latitude,
        longitude,
        photo_before_url: photoUrl || undefined,
        photo_url: photoUrl || undefined,
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Page Header */}
      <PageHeader
        className="mb-8"
        badge={
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border">
            <Sparkles className="w-3.5 h-3.5 text-info" />
            <span>{t.brandName} • {t.brandCity}</span>
          </div>
        }
        title={requestType === 'idea' ? t.createTitleIdea : t.createTitleProblem}
        description={t.createSubtitle}
      />

      {/* Main Submission Card */}
      <div className="bg-card rounded-xl border-2 border-border shadow-md p-6 sm:p-8">
        
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg bg-danger-soft border-2 border-danger-soft text-danger-soft-foreground text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Request Type Selector: Problem vs Idea */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-foreground mb-2">
              Тип обращения
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRequestType('problem')}
                className={`py-3 px-4 rounded-lg border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  requestType === 'problem'
                    ? 'bg-danger-soft border-red-600 text-danger-soft-foreground shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
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
                    ? 'bg-warning-soft border-amber-500 text-warning-soft-foreground shadow-xs'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
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
              <label className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                {requestType === 'idea' ? t.createTextLabelIdea : t.createTextLabelProblem}
              </label>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-danger text-danger-foreground animate-pulse'
                    : 'bg-muted text-foreground hover:bg-muted/80 border border-border'
                }`}
                title="Голосовой ввод сообщения"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Идет запись...' : 'Голосовой ввод'}</span>
              </button>
            </div>

            {voiceNotice && (
              <div className="mb-2 text-xs font-bold text-info-soft-foreground bg-info-soft px-3 py-1.5 rounded border border-info-soft">
                {voiceNotice}
              </div>
            )}

            <div className="relative">
              <textarea
                rows={5}
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder={t.createTextPlaceholder}
                className={`w-full p-4 rounded-lg border-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                  isWordCountExceeded ? 'border-danger bg-danger-soft/20' : 'border-border focus:border-ring bg-card'
                }`}
              />

              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-muted-foreground font-sans">
                  ИИ автоматически сформулирует официальный запрос
                </span>
                <span className={`font-bold ${isWordCountExceeded ? 'text-danger' : 'text-muted-foreground'}`}>
                  {wordCount} / 200 слов
                </span>
              </div>
            </div>
          </div>

          {/* 3. Address & Location with GPS button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                {t.createAddressLabel}
              </label>

              <button
                type="button"
                onClick={handleSimulateGPS}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-info-soft-foreground hover:text-info-soft-foreground hover:underline cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                <span>{t.createGpsBtn}</span>
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.createAddressPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-lg border-2 border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring font-medium"
              />
            </div>
          </div>

          {/* 4. Photo Attachment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                {t.createPhotoLabel}
              </label>
              <span className="text-[11px] text-muted-foreground font-medium">
                {photoUrl ? t.createPhotoAttached : t.createPhotoHint}
              </span>
            </div>

            {/* Hidden device and camera file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {photoUrl ? (
              <div className="p-4 bg-muted/60 border-2 border-border rounded-xl flex flex-col sm:flex-row items-center gap-4">
                <div 
                  className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0 border-2 border-border/80 shadow-xs relative overflow-hidden"
                  style={{ backgroundImage: `url('${photoUrl}')` }}
                />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="text-sm font-bold text-foreground truncate">
                    {photoFileName || t.createPhotoAttached}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                    {photoFileSize && <span>{photoFileSize}</span>}
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'kz' ? 'Жүктелді' : lang === 'en' ? 'Uploaded' : 'Загружено'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{t.createPhotoReplace}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setPhotoFileName('');
                        setPhotoFileSize('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                        if (cameraInputRef.current) cameraInputRef.current.value = '';
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t.createPhotoDelete}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleImageFile(file);
                }}
                className="p-6 border-2 border-dashed border-border hover:border-foreground/30 rounded-xl text-center bg-card/40 transition-colors flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {t.createPhotoDropzone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.createPhotoHint}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border-2 border-border hover:border-foreground/40 text-xs font-bold text-foreground transition-all shadow-xs cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t.createPhotoCamera}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-95 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t.createPhotoDevice}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 5. Guest Contact Prompt (if user is guest) */}
          {isGuest && (
            <div className="p-4 bg-info-soft border-2 border-info-soft rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-info-soft-foreground" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-info-soft-foreground">
                  Контактные данные заявителя
                </span>
              </div>
              <p className="text-xs text-info-soft-foreground leading-relaxed font-medium">
                По регламенту города Семей, для регистрации официального обращения укажите имя и телефон для обратной связи служб.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Айгүл Ахметова"
                    className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:border-ring"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Номер телефона
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+7 (705) 000-00-00"
                    className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:border-ring"
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
              className="mt-1 w-4 h-4 rounded text-foreground border-border focus:ring-ring cursor-pointer"
            />
            <label htmlFor="anonymous" className="text-xs text-foreground font-medium cursor-pointer">
              <span className="font-bold">{t.createAnonymousLabel}</span> — {t.createAnonymousHint}
            </label>
          </div>

          {/* 7. Submit Action Button (1-Click with Silent AI Processing) */}
          <div className="pt-4 border-t-2 border-border">
            <button
              type="submit"
              disabled={isSubmitting || isWordCountExceeded}
              className={`w-full py-4 px-6 rounded-lg font-bold text-base flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer ${
                isSubmitting 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
                  <span>{t.createSubmitting}</span>
                </>
              ) : (
                <>
                  <span>{t.createSubmitBtn}</span>
                  <ArrowRight className="w-5 h-5 text-primary-foreground" />
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground text-center mt-2 font-medium">
              ИИ структурирует текст, определит службу и назначит приоритет автоматически
            </p>
          </div>

        </form>
      </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted text-foreground">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-foreground" />
          </div>
        }>
          <CreateRequestContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
