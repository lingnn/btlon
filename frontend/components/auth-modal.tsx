'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Đăng Nhập / Đăng Kí</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Chọn một tùy chọn để tiếp tục
          </p>

          <Link href="/login" onClick={onClose} className="block">
            <Button className="w-full bg-[#b31f24] hover:bg-[#8f191d]">
              Đăng Nhập
            </Button>
          </Link>

          <Link href="/register" onClick={onClose} className="block">
            <Button variant="outline" className="w-full">
              Đăng Kí
            </Button>
          </Link>

          <p className="text-center text-xs text-muted-foreground">
            Yêu cầu đăng nhập để nộp hồ sơ online
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

