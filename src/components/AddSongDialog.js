import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Button } from "src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Label } from "src/components/ui/label";
import { Music, Link, Calendar } from 'lucide-react';

const GENRE_OPTIONS = [
  "Rock", "Classic Rock", "Hard Rock", "Blues", "Jazz", "Metal",
  "Pop Rock", "Alternative", "Indie", "Folk", "Acoustic"
];

const AddSongDialog = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    period: '',
    genres: [],
  });
  const [loading, setLoading] = useState(false);

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const youtubeId = getYoutubeId(formData.youtubeUrl);
    if (!youtubeId) {
      alert('올바른 YouTube URL을 입력해주세요.');
      setLoading(false);
      return;
    }

    const newSong = {
      id: Date.now(),
      title: formData.title,
      artist: formData.artist,
      youtubeId,
      category: formData.category,
      date: formData.date,
      period: formData.period,
      genres: formData.genres,
    };

    try {
      await onAdd(newSong);
      onClose();
      setFormData({
        title: '',
        artist: '',
        youtubeUrl: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        period: '',
        genres: [],
      });
    } catch (error) {
      alert('곡을 추가하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center">새로운 곡 추가</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                곡 제목
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="곡 제목을 입력하세요"
                className="bg-gray-50 placeholder:text-gray-400 rounded-xl border border-gray-800"
              />
            </div>

            {/* 아티스트 */}
            <div className="space-y-2">
              <Label htmlFor="artist">아티스트</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                placeholder="아티스트 이름을 입력하세요"
                className="bg-gray-50 placeholder:text-gray-400 rounded-xl border border-gray-800"
              />
            </div>
            
            {/* YouTube URL 입력 */}
            <div className="space-y-2">
              <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                YouTube URL
              </Label>
              <Input
                id="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleYoutubeUrlChange}
                placeholder="https://www.youtube.com/watch?v=..."
                className="bg-gray-50 placeholder:text-gray-400 rounded-xl border border-gray-800"
              />
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label>카테고리</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-50 rounded-xl border border-gray-800">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="band" className="bg-white focus:bg-blue-100 hover:bg-blue-200">밴드 합주곡</SelectItem>
                  <SelectItem value="practice" className="bg-white focus:bg-blue-100 hover:bg-blue-200">개인 연습곡</SelectItem>
                  <SelectItem value="wishlist" className="bg-white focus:bg-blue-100 hover:bg-blue-200">연주하고 싶은 곡</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 합주 기간 (밴드 합주곡인 경우에만 표시) */}
            {formData.category === 'band' && (
              <div className="space-y-2">
                <Label htmlFor="period" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  합주 기간
                </Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                  placeholder="예: 2024.09~2024.11"
                  className={`bg-gray-50 rounded-xl border border-gray-800 ${formData.period ? 'text-gray-800' : 'text-gray-400'
                    }`}
                />

              </div>
            )}

            {/* 장르 선택 */}
            <div className="space-y-2">
              <Label>장르 (최대 3개)</Label>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.genres.includes(genre)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        genres: prev.genres.includes(genre)
                          ? prev.genres.filter(g => g !== genre)
                          : prev.genres.length < 3
                            ? [...prev.genres, genre]
                            : prev.genres
                      }));
                    }}
                    disabled={!formData.genres.includes(genre) && formData.genres.length >= 3}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 rounded-xl border border-0"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl border border-0"
              disabled={loading || !formData.title || !formData.artist || !formData.youtubeUrl || !formData.category}
            >
              {loading ? "추가 중..." : "추가하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSongDialog;