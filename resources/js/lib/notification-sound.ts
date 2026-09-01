let audioContext: AudioContext | null = null;
let unlocked = false;
let lastPlayedAt = 0;

const MIN_SOUND_INTERVAL_MS = 2_000;

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const AudioContextClass =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;

    if (!AudioContextClass) {
        return null;
    }

    audioContext ??= new AudioContextClass();

    return audioContext;
}

function markUnlocked(): void {
    unlocked = true;

    const context = getAudioContext();

    if (context && context.state === 'suspended') {
        void context.resume();
    }
}

export function unlockNotificationSound(): () => void {
    const unlock = () => markUnlocked();

    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    return () => {
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
    };
}

/** Débloque l'audio immédiatement (ex. clic sur Connexion). */
export function primeNotificationSound(): void {
    markUnlocked();
}

export function playNotificationSound(): void {
    playTones([
        { frequency: 880, offset: 0, duration: 0.22 },
        { frequency: 1174.66, offset: 0.18, duration: 0.32 },
    ]);
}

/** Son court et positif pour les toasts de succès. */
export function playSuccessSound(): void {
    playTones([
        { frequency: 523.25, offset: 0, duration: 0.14 },
        { frequency: 659.25, offset: 0.1, duration: 0.16 },
        { frequency: 783.99, offset: 0.2, duration: 0.28 },
    ]);
}

/** Arpège plus long pour saluer une nouvelle connexion. */
export function playWelcomeSound(): void {
    playTones(
        [
            { frequency: 392.0, offset: 0, duration: 0.22 },
            { frequency: 523.25, offset: 0.16, duration: 0.24 },
            { frequency: 659.25, offset: 0.34, duration: 0.28 },
            { frequency: 783.99, offset: 0.54, duration: 0.42 },
        ],
        { bypassThrottle: true, peakGain: 0.22 },
    );
}

type Tone = {
    frequency: number;
    offset: number;
    duration: number;
};

type PlayTonesOptions = {
    bypassThrottle?: boolean;
    peakGain?: number;
};

function playTones(tones: Tone[], options: PlayTonesOptions = {}): void {
    if (!unlocked) {
        return;
    }

    const nowMs = Date.now();

    if (
        !options.bypassThrottle &&
        nowMs - lastPlayedAt < MIN_SOUND_INTERVAL_MS
    ) {
        return;
    }

    lastPlayedAt = nowMs;

    const context = getAudioContext();

    if (!context) {
        return;
    }

    const play = () => {
        const now = context.currentTime;

        for (const tone of tones) {
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            const start = now + tone.offset;

            const peak = options.peakGain ?? 0.28;

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(tone.frequency, start);
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(peak, start + 0.03);
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                start + tone.duration,
            );

            oscillator.connect(gain);
            gain.connect(context.destination);

            oscillator.start(start);
            oscillator.stop(start + tone.duration);
        }
    };

    if (context.state === 'suspended') {
        void context.resume().then(() => {
            markUnlocked();
            play();
        });

        return;
    }

    markUnlocked();
    play();
}
