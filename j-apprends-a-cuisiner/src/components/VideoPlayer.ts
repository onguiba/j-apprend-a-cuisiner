export class VideoPlayer {
  private container: HTMLElement;
  private videoElement: HTMLVideoElement | null = null;
  private subtitleTrack: HTMLTrackElement | null = null;
  private currentRecipeId: number | null = null;

  constructor(containerId: string) {
    const element = document.getElementById(containerId);
    if (!element) {
      throw new Error(`Container with id ${containerId} not found`);
    }
    this.container = element;
  }

  public loadVideo(videoUrl: string, subtitleUrl?: string, recipeId?: number): void {
    this.currentRecipeId = recipeId || null;
    this.container.innerHTML = '';

    // Créer le conteneur vidéo
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-player-container';

    // Créer l'élément vidéo
    this.videoElement = document.createElement('video');
    this.videoElement.className = 'recipe-video';
    this.videoElement.controls = true;
    this.videoElement.preload = 'metadata';
    
    // Ajouter la source vidéo
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = this.getVideoType(videoUrl);
    this.videoElement.appendChild(source);

    // Ajouter les sous-titres si disponibles
    if (subtitleUrl) {
      this.subtitleTrack = document.createElement('track');
      this.subtitleTrack.kind = 'subtitles';
      this.subtitleTrack.label = 'Français';
      this.subtitleTrack.srclang = 'fr';
      this.subtitleTrack.src = subtitleUrl;
      this.subtitleTrack.default = true;
      this.videoElement.appendChild(this.subtitleTrack);
    }

    // Créer les contrôles personnalisés
    const controls = this.createCustomControls();

    videoContainer.appendChild(this.videoElement);
    videoContainer.appendChild(controls);
    this.container.appendChild(videoContainer);

    // Ajouter les événements
    this.attachEventListeners();
  }

  private createCustomControls(): HTMLElement {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'video-custom-controls';
    controlsDiv.innerHTML = `
      <div class="video-controls-row">
        <button class="video-btn play-pause-btn" title="Lecture/Pause">
          <span class="play-icon">▶</span>
          <span class="pause-icon" style="display: none;">⏸</span>
        </button>
        
        <div class="video-progress-container">
          <div class="video-progress-bar">
            <div class="video-progress-filled"></div>
          </div>
          <div class="video-time">
            <span class="current-time">0:00</span> / <span class="duration">0:00</span>
          </div>
        </div>

        <button class="video-btn subtitle-btn" title="Sous-titres">
          <span>CC</span>
        </button>

        <button class="video-btn speed-btn" title="Vitesse">
          <span>1x</span>
        </button>

        <button class="video-btn fullscreen-btn" title="Plein écran">
          <span>⛶</span>
        </button>
      </div>
    `;
    return controlsDiv;
  }

  private attachEventListeners(): void {
    if (!this.videoElement) return;

    const playPauseBtn = this.container.querySelector('.play-pause-btn') as HTMLButtonElement;
    const progressBar = this.container.querySelector('.video-progress-bar') as HTMLElement;
    const subtitleBtn = this.container.querySelector('.subtitle-btn') as HTMLButtonElement;
    const speedBtn = this.container.querySelector('.speed-btn') as HTMLButtonElement;
    const fullscreenBtn = this.container.querySelector('.fullscreen-btn') as HTMLButtonElement;

    // Lecture/Pause
    playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
    this.videoElement.addEventListener('click', () => this.togglePlayPause());

    // Mise à jour de la progression
    this.videoElement.addEventListener('timeupdate', () => this.updateProgress());
    this.videoElement.addEventListener('loadedmetadata', () => this.updateDuration());

    // Barre de progression cliquable
    progressBar?.addEventListener('click', (e) => this.seek(e));

    // Sous-titres
    subtitleBtn?.addEventListener('click', () => this.toggleSubtitles());

    // Vitesse de lecture
    speedBtn?.addEventListener('click', () => this.changeSpeed());

    // Plein écran
    fullscreenBtn?.addEventListener('click', () => this.toggleFullscreen());

    // Événements de lecture
    this.videoElement.addEventListener('play', () => this.onPlay());
    this.videoElement.addEventListener('pause', () => this.onPause());
    this.videoElement.addEventListener('ended', () => this.onEnded());
  }

  private togglePlayPause(): void {
    if (!this.videoElement) return;

    if (this.videoElement.paused) {
      this.videoElement.play();
    } else {
      this.videoElement.pause();
    }
  }

  private onPlay(): void {
    const playIcon = this.container.querySelector('.play-icon') as HTMLElement;
    const pauseIcon = this.container.querySelector('.pause-icon') as HTMLElement;
    if (playIcon) playIcon.style.display = 'none';
    if (pauseIcon) pauseIcon.style.display = 'inline';
  }

  private onPause(): void {
    const playIcon = this.container.querySelector('.play-icon') as HTMLElement;
    const pauseIcon = this.container.querySelector('.pause-icon') as HTMLElement;
    if (playIcon) playIcon.style.display = 'inline';
    if (pauseIcon) pauseIcon.style.display = 'none';
  }

  private onEnded(): void {
    this.onPause();
    // Optionnel: afficher un message ou proposer une autre recette
  }

  private updateProgress(): void {
    if (!this.videoElement) return;

    const progressFilled = this.container.querySelector('.video-progress-filled') as HTMLElement;
    const currentTimeSpan = this.container.querySelector('.current-time') as HTMLElement;

    const percent = (this.videoElement.currentTime / this.videoElement.duration) * 100;
    if (progressFilled) progressFilled.style.width = `${percent}%`;
    if (currentTimeSpan) currentTimeSpan.textContent = this.formatTime(this.videoElement.currentTime);
  }

  private updateDuration(): void {
    if (!this.videoElement) return;

    const durationSpan = this.container.querySelector('.duration') as HTMLElement;
    if (durationSpan) durationSpan.textContent = this.formatTime(this.videoElement.duration);
  }

  private seek(e: MouseEvent): void {
    if (!this.videoElement) return;

    const progressBar = e.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.videoElement.currentTime = percent * this.videoElement.duration;
  }

  private toggleSubtitles(): void {
    if (!this.videoElement) return;

    const tracks = this.videoElement.textTracks;
    if (tracks.length > 0) {
      const track = tracks[0];
      track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
      
      const subtitleBtn = this.container.querySelector('.subtitle-btn') as HTMLButtonElement;
      if (subtitleBtn) {
        subtitleBtn.classList.toggle('active', track.mode === 'showing');
      }
    }
  }

  private changeSpeed(): void {
    if (!this.videoElement) return;

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(this.videoElement.playbackRate);
    const nextIndex = (currentIndex + 1) % speeds.length;
    this.videoElement.playbackRate = speeds[nextIndex];

    const speedBtn = this.container.querySelector('.speed-btn span') as HTMLElement;
    if (speedBtn) speedBtn.textContent = `${speeds[nextIndex]}x`;
  }

  private toggleFullscreen(): void {
    const videoContainer = this.container.querySelector('.video-player-container') as HTMLElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private getVideoType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
        return 'video/mp4';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      default:
        return 'video/mp4';
    }
  }

  public destroy(): void {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = '';
      this.videoElement = null;
    }
    this.container.innerHTML = '';
  }
}
