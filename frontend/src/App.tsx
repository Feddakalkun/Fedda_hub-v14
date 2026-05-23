import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Film, Images, LayoutDashboard, MessageSquare, Music, Sparkles, Video } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { TopSystemStrip } from './components/ui/TopSystemStrip';
import { ToastProvider } from './components/ui/Toast';
import { ComfyExecutionProvider } from './contexts/ComfyExecutionContext';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { VideoStudioPage } from './pages/VideoStudioPage';
type RootSection = 'hub' | 'image' | 'video' | 'xxx' | 'explore';
type AppView = 'hub' | 'section' | 'workspace';

type ToolItem = { tab: string; label: string; description: string };
type HubItem = {
  id: RootSection;
  label: string;
  description: string;
  Icon: typeof Sparkles;
  directTab?: string;
};

const ENABLED_SECTIONS = new Set<Exclude<RootSection, 'hub'>>(['video']);
const ENABLED_WORKFLOW_TABS = new Set(['wan21-steady-dancer']);

const HUB_CARDS: HubItem[] = [
  {
    id: 'hub',
    label: 'Agent Chat',
    description: 'Assistant, planning and execution.',
    Icon: MessageSquare,
    directTab: 'chat',
  },
  {
    id: 'image',
    label: 'Image Studio',
    description: 'Z-Image, Qwen, FLUX and Influencer.',
    Icon: Sparkles,
  },
  {
    id: 'video',
    label: 'Video Studio',
    description: 'WAN and LTX pipelines.',
    Icon: Video,
  },
  {
    id: 'xxx',
    label: 'XXX',
    description: 'Private workflow collection.',
    Icon: Film,
  },
  {
    id: 'explore',
    label: 'Explore',
    description: 'Gallery, videos and LoRA library.',
    Icon: Images,
  },
];

const isHubItemEnabled = (item: HubItem) => {
  if (item.directTab) return ENABLED_WORKFLOW_TABS.has(item.directTab);
  return item.id !== 'hub' && ENABLED_SECTIONS.has(item.id);
};

const isWorkflowTabEnabled = (tab: string) => ENABLED_WORKFLOW_TABS.has(tab);

const TOOL_GROUPS: Record<Exclude<RootSection, 'hub'>, Array<{ title: string; tools: ToolItem[] }>> = {
  image: [
    {
      title: 'Z-Image',
      tools: [
        { tab: 'z-image-txt2img', label: 'Txt2Img', description: 'Core Z-Image generation.' },
        { tab: 'z-image-img2img', label: 'Img2Img', description: 'Pose-preserving image-to-image refinement.' },
        { tab: 'z-image-dual-lora', label: 'Dual LoRA', description: 'Two-character staged workflow.' },
      ],
    },
    {
      title: 'FLUX2-KLEIN',
      tools: [{ tab: 'flux-txt2img', label: 'Txt2Img', description: 'FLUX2-KLEIN generation.' }],
    },
    {
      title: 'Qwen',
      tools: [
        { tab: 'qwen-txt2img', label: 'Txt2Img', description: 'Qwen image generation.' },
        { tab: 'qwen-image-ref', label: 'Image Reference', description: 'Keep identity with image guidance.' },
        { tab: 'qwen-multi-angle', label: 'Multi Angles', description: 'Camera-angle variants from one source.' },
      ],
    },
    {
      title: 'Other',
      tools: [{ tab: 'image-influencer', label: 'Influencer', description: 'Guided influencer creation flow.' }],
    },
    {
      title: 'SD IMAGE',
      tools: [
        { tab: 'sdxl-default', label: 'Default SDXL', description: 'Core SDXL text-to-image generation.' },
        { tab: 'sdxl-controlnet', label: 'ControlNet', description: 'ControlNet guided generation.' },
        { tab: 'sdxl-batch-processor', label: 'Batch Processor', description: 'Batch-oriented SDXL processing.' },
        { tab: 'sdxl-ip-adapter-2x-img2img', label: 'IP Adapter 2x Img2Img', description: 'Dual-pass IP Adapter img2img.' },
        { tab: 'sdxl-2000px-latent-upscale', label: '2000PX Latent Upscale', description: 'Latent upscale quality pipeline.' },
        { tab: 'sdxl-remove-background', label: 'Remove BG', description: 'Background removal workflow.' },
        { tab: 'sdxl-cn-openpose', label: 'CN OpenPose', description: 'OpenPose-conditioned ControlNet.' },
        { tab: 'sdxl-ip-adapter-style-transfer', label: 'IP Adapter Style Transfer', description: 'Style transfer with IP Adapter.' },
        { tab: 'sdxl-ip-adapter-img2img', label: 'IP Adapter Img2Img', description: 'IP Adapter image-to-image flow.' },
        { tab: 'sdxl-inpaint-pro', label: 'Inpaint Pro', description: 'Advanced inpainting workflow.' },
        { tab: 'sdxl-cn-canny', label: 'CN Canny', description: 'Canny-conditioned ControlNet.' },
        { tab: 'sdxl-sd-upscale', label: 'SD Upscale', description: 'Super-resolution upscale flow.' },
        { tab: 'sdxl-cn-depth', label: 'CN Depth', description: 'Depth-conditioned ControlNet.' },
        { tab: 'sdxl-outpaint', label: 'Outpaint', description: 'Canvas extension workflow.' },
      ],
    },
  ],
  video: [
    {
      title: 'WAN',
      tools: [
        { tab: 'wan21-steady-dancer', label: 'WAN 2.1 Steady Dancer', description: 'Motion transfer from reference video.' },
        { tab: 'wan22-vid2vid', label: 'WAN 2.2 Vid2Vid', description: 'Transform existing video.' },
        { tab: 'wan22-img2vid', label: 'WAN 2.2 Img2Vid', description: 'Animate still images.' },
        { tab: 'wan22-img2vid-6frames', label: 'WAN 2.2 Story (6 Frames)', description: 'Storyboard to video pipeline.' },
      ],
    },
    {
      title: 'LTX',
      tools: [
        { tab: 'ltx-flf', label: 'First / Last Frame', description: 'Generate in-between sequence from keyframes.' },
        { tab: 'ltx-img-audio', label: 'Img + Audio Lipsync', description: 'Lipsync from image + audio.' },
      ],
    },
  ],
  xxx: [
    {
      title: 'XXX Image',
      tools: [
        { tab: 'xxx-influencer', label: 'Influencer', description: 'Influencer workflow variant.' },
        { tab: 'xxx-realism-sdxl', label: 'Realism SDXL', description: 'Realism SDXL workflow.' },
        { tab: 'xxx-sdxl-batch', label: 'SDXL Batch', description: 'Batch SDXL generation.' },
        { tab: 'xxx-klein-nsfw', label: 'Klein NSFW', description: 'FLUX/Klein variant.' },
        { tab: 'xxx-flux', label: 'Flux XXX', description: 'Flux image workflow.' },
      ],
    },
    {
      title: 'XXX Video',
      tools: [
        { tab: 'xxx-wan22', label: 'WAN 22 XXX', description: 'WAN 2.2 variant.' },
        { tab: 'xxx-wan-img2vid', label: 'WAN Img2Vid XXX', description: 'WAN image to video variant.' },
        { tab: 'xxx-bouncy-walk', label: 'Bouncy Walk', description: 'Motion video workflow.' },
        { tab: 'xxx-infinite-video', label: 'Infinite Video', description: 'Long-form video workflow.' },
        { tab: 'xxx-blowjob-img2vid', label: 'BJ Img2Vid', description: 'Image to video variant.' },
        { tab: 'xxx-blowjob-vid2vid', label: 'BJ Vid2Vid', description: 'Video to video variant.' },
      ],
    },
  ],
  explore: [
    {
      title: 'Explore',
      tools: [
        { tab: 'gallery', label: 'Gallery', description: 'Image history and downloads.' },
        { tab: 'videos', label: 'Videos', description: 'Video history and downloads.' },
        { tab: 'library', label: 'LoRA Library', description: 'Install and manage LoRAs.' },
      ],
    },
  ],
};

const VALID_TABS = new Set([
  'chat',
  'image',
  'z-image',
  'z-image-txt2img',
  'z-image-dual-lora',
  'z-image-img2img',
  'flux',
  'flux-txt2img',
  'qwen',
  'qwen-txt2img',
  'qwen-image-ref',
  'qwen-multi-angle',
  'image-other',
  'image-influencer',
  'sdxl-default',
  'sdxl-controlnet',
  'sdxl-batch-processor',
  'sdxl-ip-adapter-2x-img2img',
  'sdxl-2000px-latent-upscale',
  'sdxl-remove-background',
  'sdxl-cn-openpose',
  'sdxl-ip-adapter-style-transfer',
  'sdxl-ip-adapter-img2img',
  'sdxl-inpaint-pro',
  'sdxl-cn-canny',
  'sdxl-sd-upscale',
  'sdxl-cn-depth',
  'sdxl-outpaint',
  'sdxl-sd-image',
  'video',
  'wan21-steady-dancer',
  'wan22-vid2vid',
  'wan22-img2vid',
  'wan22-img2vid-6frames',
  'ltx',
  'ltx-flf',
  'ltx-img-audio',
  'xxx',
  'xxx-influencer',
  'xxx-realism-sdxl',
  'xxx-sdxl-batch',
  'xxx-klein-nsfw',
  'xxx-flux',
  'xxx-wan22',
  'xxx-wan-img2vid',
  'xxx-bouncy-walk',
  'xxx-infinite-video',
  'xxx-blowjob-img2vid',
  'xxx-blowjob-vid2vid',
  'audio',
  'gallery',
  'videos',
  'library',
]);

const PAGE_META: Record<string, { label: string; description: string; Icon: typeof Sparkles }> = {
  chat: { label: 'Agent Chat', description: 'Your AI assistant and creative collaborator.', Icon: MessageSquare },
  image: { label: 'Image Studio', description: 'Generate and edit images with advanced AI models.', Icon: Sparkles },
  'z-image': { label: 'Z-Image', description: 'Z-Image workflow family.', Icon: Sparkles },
  'z-image-txt2img': { label: 'Z-Image (Txt2Img)', description: 'Premium text to image generation.', Icon: Sparkles },
  'z-image-dual-lora': { label: 'Z-Image (Dual LoRA)', description: 'Two-person staged workflow.', Icon: Sparkles },
  'z-image-img2img': { label: 'Z-Image (Img2Img)', description: 'Pose-preserving image-to-image workflow.', Icon: Sparkles },
  flux: { label: 'FLUX2-KLEIN Studio', description: 'FLUX2-KLEIN workflow family.', Icon: Sparkles },
  'flux-txt2img': { label: 'FLUX2-KLEIN (Txt2Img)', description: 'Txt2Img workspace for FLUX2-KLEIN.', Icon: Sparkles },
  qwen: { label: 'Qwen Studio', description: 'Qwen workflow family.', Icon: Sparkles },
  'qwen-txt2img': { label: 'Qwen (Txt2Img)', description: 'Txt2Img workspace for Qwen.', Icon: Sparkles },
  'qwen-image-ref': { label: 'Qwen (Image Reference)', description: 'Generate from a reference image.', Icon: Sparkles },
  'qwen-multi-angle': { label: 'Qwen (Multi Angles)', description: 'Generate camera-angle variants.', Icon: Sparkles },
  'image-other': { label: 'Other Workflows', description: 'Uncategorized image workflows.', Icon: Sparkles },
  'image-influencer': { label: 'Influencer', description: 'Identity-locked creator workflow.', Icon: Sparkles },
  'sdxl-default': { label: 'Default SDXL', description: 'Core SDXL text-to-image workflow.', Icon: Sparkles },
  'sdxl-controlnet': { label: 'ControlNet', description: 'SDXL ControlNet workflow.', Icon: Sparkles },
  'sdxl-batch-processor': { label: 'Batch Processor', description: 'SDXL batch processor workflow.', Icon: Sparkles },
  'sdxl-ip-adapter-2x-img2img': { label: 'IP Adapter 2x Img2Img', description: 'Dual IP Adapter image-to-image flow.', Icon: Sparkles },
  'sdxl-2000px-latent-upscale': { label: '2000PX Latent Upscale', description: 'High-quality latent upscale workflow.', Icon: Sparkles },
  'sdxl-remove-background': { label: 'Remove BG', description: 'Background removal workflow.', Icon: Sparkles },
  'sdxl-cn-openpose': { label: 'CN OpenPose', description: 'OpenPose ControlNet workflow.', Icon: Sparkles },
  'sdxl-ip-adapter-style-transfer': { label: 'IP Adapter Style Transfer', description: 'Style-transfer workflow with IP Adapter.', Icon: Sparkles },
  'sdxl-ip-adapter-img2img': { label: 'IP Adapter Img2Img', description: 'IP Adapter image-guided workflow.', Icon: Sparkles },
  'sdxl-inpaint-pro': { label: 'Inpaint Pro', description: 'Advanced inpainting workflow.', Icon: Sparkles },
  'sdxl-cn-canny': { label: 'CN Canny', description: 'Canny edge ControlNet workflow.', Icon: Sparkles },
  'sdxl-sd-upscale': { label: 'SD Upscale', description: 'Upscale workflow.', Icon: Sparkles },
  'sdxl-cn-depth': { label: 'CN Depth', description: 'Depth ControlNet workflow.', Icon: Sparkles },
  'sdxl-outpaint': { label: 'Outpaint', description: 'Canvas extension workflow.', Icon: Sparkles },
  'sdxl-sd-image': { label: 'SD IMAGE', description: 'SDXL workflow family.', Icon: Sparkles },
  video: { label: 'Video Studio', description: 'Create and animate video sequences with WAN.', Icon: Video },
  'wan21-steady-dancer': { label: 'WAN 2.1 Steady Dancer', description: 'Reference-motion transfer.', Icon: Video },
  'wan22-vid2vid': { label: 'WAN 2.2 Vid2Vid', description: 'Extend and transform video with WAN 2.2.', Icon: Video },
  'wan22-img2vid': { label: 'WAN 2.2 Img2Vid', description: 'Animate still images.', Icon: Video },
  'wan22-img2vid-6frames': { label: 'WAN 2.2 Story (6 Frames)', description: 'Storyboard flow with WAN 2.2.', Icon: Video },
  ltx: { label: 'LTX Video', description: 'LTX video workflows.', Icon: Film },
  'ltx-flf': { label: 'LTX - First / Last Frame', description: 'Generate between keyframes.', Icon: Film },
  'ltx-img-audio': { label: 'LTX - Img + Audio Lipsync', description: 'Image + audio lipsync workflow.', Icon: Film },
  xxx: { label: 'XXX', description: 'Private workflow section.', Icon: Film },
  'xxx-influencer': { label: 'XXX Influencer', description: 'Influencer variant.', Icon: Sparkles },
  'xxx-realism-sdxl': { label: 'XXX Realism SDXL', description: 'Realism SDXL variant.', Icon: Sparkles },
  'xxx-sdxl-batch': { label: 'XXX SDXL Batch', description: 'Batch SDXL workflow.', Icon: Sparkles },
  'xxx-klein-nsfw': { label: 'XXX Klein NSFW', description: 'Klein workflow variant.', Icon: Sparkles },
  'xxx-flux': { label: 'XXX Flux', description: 'Flux workflow variant.', Icon: Sparkles },
  'xxx-wan22': { label: 'XXX WAN 2.2', description: 'WAN 2.2 variant.', Icon: Video },
  'xxx-wan-img2vid': { label: 'XXX WAN Img2Vid', description: 'WAN Img2Vid variant.', Icon: Video },
  'xxx-bouncy-walk': { label: 'XXX Bouncy Walk', description: 'Motion video workflow.', Icon: Video },
  'xxx-infinite-video': { label: 'XXX Infinite Video', description: 'Long-form video workflow.', Icon: Video },
  'xxx-blowjob-img2vid': { label: 'XXX BJ Img2Vid', description: 'Image-to-video workflow.', Icon: Video },
  'xxx-blowjob-vid2vid': { label: 'XXX BJ Vid2Vid', description: 'Video-to-video workflow.', Icon: Video },
  audio: { label: 'Audio / SFX', description: 'Generate music, voice and sound effects.', Icon: Music },
  gallery: { label: 'Gallery', description: 'Browse generated images.', Icon: Images },
  videos: { label: 'Videos', description: 'Browse generated videos.', Icon: Film },
  library: { label: 'LoRA Library', description: 'Manage installed LoRAs.', Icon: LayoutDashboard },
};

const TAB_KEY = 'fedda_v14_active_tab';
const LANDING_KEY = 'fedda_v14_landing_seen';

type NavState = {
  view: AppView;
  activeTab: string;
  activeSection: Exclude<RootSection, 'hub'> | null;
  workspaceOrigin: 'hub' | 'section';
};

function readActiveTab(): string {
  try {
    const raw = localStorage.getItem(TAB_KEY);
    if (raw && VALID_TABS.has(raw)) return raw;
  } catch {}
  return 'chat';
}

function deriveSectionFromTab(tab: string): Exclude<RootSection, 'hub'> | null {
  if (tab.startsWith('z-image') || tab.startsWith('flux') || tab.startsWith('qwen') || tab.startsWith('image-') || tab.startsWith('sdxl-')) {
    return 'image';
  }
  if (tab.startsWith('xxx')) return 'xxx';
  if (tab.startsWith('wan') || tab.startsWith('ltx') || tab === 'video') return 'video';
  if (tab === 'gallery' || tab === 'videos' || tab === 'library') return 'explore';
  return null;
}

function parseNavFromUrl(): Partial<NavState> {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab') ?? undefined;
  const view = params.get('view') as AppView | null;
  const section = params.get('section') as Exclude<RootSection, 'hub'> | null;
  return {
    activeTab: tab && VALID_TABS.has(tab) ? tab : undefined,
    view: view === 'hub' || view === 'section' || view === 'workspace' ? view : undefined,
    activeSection: section === 'image' || section === 'video' || section === 'xxx' || section === 'explore' ? section : undefined,
  };
}

function writeNavToUrl(state: NavState, mode: 'push' | 'replace') {
  const params = new URLSearchParams(window.location.search);
  params.set('tab', state.activeTab);
  params.set('view', state.view);
  if (state.activeSection) params.set('section', state.activeSection);
  else params.delete('section');
  const url = `${window.location.pathname}?${params.toString()}`;
  if (mode === 'push') {
    window.history.pushState(state, '', url);
  } else {
    window.history.replaceState(state, '', url);
  }
}

function FeddaApp() {
  const initialNav = (() => {
    const fromUrl = parseNavFromUrl();
    const activeTab = fromUrl.activeTab ?? readActiveTab();
    const view = fromUrl.view ?? (activeTab === 'chat' ? 'hub' : 'workspace');
    const activeSection = fromUrl.activeSection ?? deriveSectionFromTab(activeTab);
    const workspaceOrigin: 'hub' | 'section' = view === 'workspace' && activeSection ? 'section' : 'hub';
    return { activeTab, view, activeSection, workspaceOrigin };
  })();

  const [showLanding, setShowLanding] = useState(() => {
    try {
      return localStorage.getItem(LANDING_KEY) !== '1';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<string>(initialNav.activeTab);
  const [view, setView] = useState<AppView>(initialNav.view);
  const [activeSection, setActiveSection] = useState<Exclude<RootSection, 'hub'> | null>(initialNav.activeSection);
  const [workspaceOrigin, setWorkspaceOrigin] = useState<'hub' | 'section'>(initialNav.workspaceOrigin);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, activeTab);
    } catch {}
  }, [activeTab]);

  useEffect(() => {
    writeNavToUrl(
      {
        view,
        activeTab,
        activeSection,
        workspaceOrigin,
      },
      'replace',
    );
  }, []);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const custom = event as CustomEvent<{ tab?: string }>;
      const tab = custom.detail?.tab;
      if (!tab || !VALID_TABS.has(tab)) return;
      const section = deriveSectionFromTab(tab);
      setActiveTab(tab);
      setView('workspace');
      setWorkspaceOrigin(section ? 'section' : 'hub');
      setActiveSection(section);
      writeNavToUrl({ view: 'workspace', activeTab: tab, activeSection: section, workspaceOrigin: section ? 'section' : 'hub' }, 'push');
    };
    window.addEventListener('fedda:navigate', onNavigate as EventListener);
    return () => window.removeEventListener('fedda:navigate', onNavigate as EventListener);
  }, []);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state as Partial<NavState> | null;
      const fallback = parseNavFromUrl();
      const tab = (state?.activeTab ?? fallback.activeTab ?? readActiveTab());
      if (!VALID_TABS.has(tab)) return;
      const nextView = (state?.view ?? fallback.view ?? 'hub') as AppView;
      const nextSection = (state?.activeSection ?? fallback.activeSection ?? deriveSectionFromTab(tab)) ?? null;
      const nextOrigin = (state?.workspaceOrigin ?? (nextView === 'workspace' && nextSection ? 'section' : 'hub')) as 'hub' | 'section';
      setActiveTab(tab);
      setView(nextView);
      setActiveSection(nextSection);
      setWorkspaceOrigin(nextOrigin);
      setShowLanding(false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const meta = PAGE_META[activeTab] ?? {
    label: 'Workspace',
    description: 'Active workspace view.',
    Icon: Sparkles,
  };
  const sectionHeaderMeta: Record<Exclude<RootSection, 'hub'>, { label: string; description: string; Icon: typeof Sparkles }> = {
    image: {
      label: 'Image Studio',
      description: 'Cards navigation for image workflows.',
      Icon: Sparkles,
    },
    video: {
      label: 'Video Studio',
      description: 'Cards navigation for video workflows.',
      Icon: Video,
    },
    xxx: {
      label: 'XXX',
      description: 'Cards navigation for private workflows.',
      Icon: Film,
    },
    explore: {
      label: 'Explore',
      description: 'Cards navigation for gallery and library tools.',
      Icon: Images,
    },
  };

  const headerMeta =
    view === 'workspace'
      ? meta
      : view === 'section' && activeSection
        ? sectionHeaderMeta[activeSection]
        : {
            label: 'FEDDA v14',
            description: 'Cards-first navigation shell',
            Icon: Sparkles,
          };
  const openWorkspace = (tab: string, origin: 'hub' | 'section') => {
    if (!VALID_TABS.has(tab)) return;
    const section = deriveSectionFromTab(tab);
    setActiveTab(tab);
    setWorkspaceOrigin(section ? origin : 'hub');
    setActiveSection(section ?? activeSection);
    setView('workspace');
    writeNavToUrl({ view: 'workspace', activeTab: tab, activeSection: section ?? activeSection, workspaceOrigin: section ? origin : 'hub' }, 'push');
  };

  const openSection = (section: Exclude<RootSection, 'hub'>) => {
    setActiveSection(section);
    setView('section');
    writeNavToUrl({ view: 'section', activeTab, activeSection: section, workspaceOrigin }, 'push');
  };

  const handleBack = () => {
    contentRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
    if (view === 'workspace') {
      const nextView = workspaceOrigin === 'section' ? 'section' : 'hub';
      setView(nextView);
      writeNavToUrl({ view: nextView, activeTab, activeSection, workspaceOrigin }, 'push');
      return;
    }
    setView('hub');
    writeNavToUrl({ view: 'hub', activeTab, activeSection, workspaceOrigin }, 'push');
  };

  const renderPage = () => {
    if (!isWorkflowTabEnabled(activeTab)) {
      return (
        <PlaceholderPage
          label={`${meta.label} (Coming Soon)`}
          description="This workflow is parked while we focus on WAN 2.1 Steady Dancer first."
          icon={<meta.Icon className="w-8 h-8" />}
        />
      );
    }
    switch (activeTab) {
      case 'wan21-steady-dancer':
        return <VideoStudioPage activeTab={activeTab} />;
      default:
        return <PlaceholderPage label={meta.label} description={meta.description} icon={<meta.Icon className="w-8 h-8" />} />;
    }
  };

  const sectionGroups = activeSection ? TOOL_GROUPS[activeSection] : [];
  const sectionTitle =
    activeSection === 'image'
      ? 'Image Studio'
      : activeSection === 'video'
        ? 'Video Studio'
        : activeSection === 'xxx'
          ? 'XXX'
          : 'Explore';

  return (
    <div className="flex h-screen theme-bg-app text-white overflow-hidden font-sans">
      {showLanding && (
        <LandingPage
          onEnter={() => {
            setShowLanding(false);
            try {
              localStorage.setItem(LANDING_KEY, '1');
            } catch {}
          }}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden theme-bg-main">
        <header className="border-b border-white/10 flex flex-col backdrop-blur-md bg-black/40 shrink-0">
          {/* Row 1: Primary Navigation & Titles */}
          <div className="h-12 px-5 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {view !== 'hub' && (
                <button
                  onClick={handleBack}
                  className="v14-icon-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <headerMeta.Icon className="w-4 h-4 text-violet-400/80" />
              <div className="leading-tight">
                <p className="text-sm font-bold tracking-tight text-white/90">{headerMeta.label}</p>
                {/* description hidden on small headers or moved to hover if needed, but for now we keep it clean */}
              </div>
              
            </div>
            
            <div className="flex items-center gap-4">
              {/* Logo / Branding */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200">FEDDA v14</span>
              </div>
            </div>
          </div>

          {/* Row 2: Technical System Strip */}
          <div className="px-4 md:px-6 py-1 border-t border-white/[0.04] bg-black/20">
            <TopSystemStrip />
          </div>
        </header>

        <div ref={contentRef} className="flex-1 overflow-auto p-5 md:p-8 custom-scrollbar">
          {view === 'hub' && (
            <div key="hub-view" className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <p className="v14-kicker">Main Modules</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {HUB_CARDS.map((card) => (
                  (() => {
                    const enabled = isHubItemEnabled(card);
                    return (
                  <button
                    key={card.label}
                    type="button"
                    className={`v14-section-panel text-left transition-colors ${enabled ? 'hover:border-violet-400/50' : 'opacity-70 border-white/10'}`}
                    onClick={() => (enabled
                      ? (card.directTab ? openWorkspace(card.directTab, 'hub') : openSection(card.id as Exclude<RootSection, 'hub'>))
                      : (card.directTab ? openWorkspace(card.directTab, 'hub') : openSection(card.id as Exclude<RootSection, 'hub'>)))}
                  >
                    <div className="flex items-start gap-3">
                      <div className="v14-icon-wrap mt-0.5">
                        <card.Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-base font-semibold text-white">{card.label}</p>
                          {!enabled && <span className="text-[10px] uppercase tracking-wider text-amber-300/90">Coming Soon</span>}
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{card.description}</p>
                      </div>
                    </div>
                  </button>
                    );
                  })()
                ))}
              </div>
            </div>
          )}

          {view === 'section' && (
            <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
              <p className="v14-kicker">{sectionTitle}</p>
              {sectionGroups.map((group) => (
                <section key={group.title} className="v14-section-panel">
                  <p className="v14-kicker mb-3">{group.title}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {group.tools.map((tool) => (
                      (() => {
                        const enabled = isWorkflowTabEnabled(tool.tab);
                        return (
                      <button
                        key={tool.tab}
                        type="button"
                        className={`v14-tool-card text-left transition-colors ${enabled ? 'hover:border-violet-400/50' : 'opacity-70 border-white/10'}`}
                        onClick={() => openWorkspace(tool.tab, 'section')}
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-[15px] font-semibold text-white">{tool.label}</p>
                          {!enabled && <span className="text-[10px] uppercase tracking-wider text-amber-300/90">Coming Soon</span>}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
                      </button>
                        );
                      })()
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {view === 'workspace' && <div className="h-full animate-fade-in">{renderPage()}</div>}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ComfyExecutionProvider>
      <ToastProvider>
        <FeddaApp />
      </ToastProvider>
    </ComfyExecutionProvider>
  );
}

