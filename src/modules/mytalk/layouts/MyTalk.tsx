import { useBranchPermissions } from "@/hooks/mytalk/use-branch-permissions";
import { Aside } from "@/modules/mytalk/channels/aside";
import { NotAllowed } from "@/modules/mytalk/not-allowed";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";
import { WebRTCButton } from "@/modules/mytalk/components/web-rtc/button-webrtc";
import { FloatingWebRTC } from "@/modules/mytalk/components/web-rtc/modal-webrtc";
import { useMicrophonePermission } from "@/modules/mytalk/components/web-rtc/hooks/use-microphone-permission";
import { MytalkLoadingSkeleton } from "./MytalkLoadingSkeleton";
import { useLogout } from "@/hooks/use-logout";
import { EmptyChat } from "@/modules/mytalk/empty";

const changeFavicon = (newFavicon: string): void => {
  let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = newFavicon;
};

function MyTalkLayout() {
  const { permissions, isLoadingBranchPermissions, error } = useBranchPermissions()
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const { logout } = useLogout()

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [showWebRTC, setShowWebRTC] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const { isChecking: isCheckingPermissions, requestPermission } =
  useMicrophonePermission();

  const handleOpenWebRTC = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowWebRTC(true);
    }
  }, [requestPermission]);

  useEffect(() => {
    document.title = "MyTalk";
    changeFavicon("/images/mytalk/mytalk-ico.png")
  }, []);

  useEffect(() => {
    if(!isLoadingBranchPermissions) {
      setFirstLoadDone(true)
    }
  }, [isLoadingBranchPermissions])

  console.log('[mytalk][MyTalkLayout] state', {
    firstLoadDone,
    isLoadingBranchPermissions,
    permissions,
    should_logout: permissions?.should_logout,
    allow_mytalk: permissions?.allow_mytalk,
    allow_webrtc: permissions?.allow_webrtc,
    error,
    pathname,
  })

  if(permissions?.should_logout) {
    console.log('[mytalk][MyTalkLayout] should_logout=true -> logout()')
    logout();
    return null;
  }
  if(!firstLoadDone && isLoadingBranchPermissions) return <MytalkLoadingSkeleton />
  if(!isLoadingBranchPermissions && !permissions?.allow_mytalk) {
    console.log('[mytalk][MyTalkLayout] NotAllowed rendered', {
      isLoadingBranchPermissions,
      firstLoadDone,
      permissions,
      error,
    })
    return <NotAllowed />
  }

  return (
    <main className="flex">
      <Aside />
      <section className="hidden md:block flex-1">
        <Outlet />

        {pathname === '/mytalk' || pathname === '/mytalk/' ? <EmptyChat /> : null}

        {permissions?.allow_webrtc ? (
          <>
            <WebRTCButton
              onClick={handleOpenWebRTC}
              onPositionChange={setButtonPosition}
              disabled={isCheckingPermissions}
            />
            <FloatingWebRTC
              isOpen={showWebRTC}
              onClose={() => setShowWebRTC(false)}
              buttonPosition={buttonPosition}
            />
          </>
        ) : null}
      </section>
    </main>
  );
}

export default MyTalkLayout;
