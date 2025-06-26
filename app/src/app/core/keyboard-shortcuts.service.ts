import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutsService {
  /**
   * Listen for specific keyboard shortcuts
   * @param shortcut The keyboard shortcut to listen for
   * @returns Observable that emits when the shortcut is pressed
   */
  onShortcut(shortcut: KeyboardShortcut): Observable<KeyboardEvent> {
    return fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event) => this.matchesShortcut(event, shortcut)),
      map((event) => {
        event.preventDefault();
        return event;
      })
    );
  }

  /**
   * Convenience method for CMD/Ctrl + S
   */
  onSave(): Observable<KeyboardEvent> {
    return this.onShortcut({
      key: 's',
      metaKey: true, // CMD on Mac, Ctrl on Windows/Linux
    });
  }

  /**
   * Convenience method for CMD/Ctrl + Z (Undo)
   */
  onUndo(): Observable<KeyboardEvent> {
    return this.onShortcut({
      key: 'z',
      metaKey: true,
    });
  }

  /**
   * Convenience method for CMD/Ctrl + Y (Redo)
   */
  onRedo(): Observable<KeyboardEvent> {
    return this.onShortcut({
      key: 'y',
      metaKey: true,
    });
  }

  private matchesShortcut(
    event: KeyboardEvent,
    shortcut: KeyboardShortcut
  ): boolean {
    return (
      event.key.toLowerCase() === shortcut.key.toLowerCase() &&
      !!event.ctrlKey === !!shortcut.ctrlKey &&
      !!event.metaKey === !!shortcut.metaKey &&
      !!event.shiftKey === !!shortcut.shiftKey &&
      !!event.altKey === !!shortcut.altKey
    );
  }
}
