import React, { useState } from 'react';
import { Search, Music, Guitar, Drum, Heart, Cloud, User, Plus, Calendar, MoreVertical, Edit2, Trash2, PlayCircle } from 'lucide-react';
import { Card, CardContent } from 'src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Input } from 'src/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import AddSongDialog from './AddSongDialog';
import EditSongDialog from './EditSongDialog';

// 샘플 데이터 - 기간 정보 추가
const initialSongs = [
  {
    id: 1,
    title: "Wonderwall",
    artist: "Oasis",
    category: "band",
    youtubeId: "6hzrDeceEKc",
    date: "2024-03-15",
    period: "매주 화요일",
    genres: ["Rock", "Britpop"]
  },
  {
    id: 2,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    category: "practice",
    youtubeId: "1w7OgIMMRc4",
    date: "2024-03-10",
    genres: ["Hard Rock", "Classic Rock"]
  },
  {
    id: 3,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    category: "wishlist",
    youtubeId: "QkF3oxziUI4",
    date: "2024-03-05",
    genres: ["Rock", "Classic Rock"]
  }
];

const GuitarRepertoireApp = () => {
  const [songs, setSongs] = useState(initialSongs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false); // AddSongDialog 상태
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // EditSongDialog 상태
  const [selectedSong, setSelectedSong] = useState(null); // Define selectedSong and its setter function
  
  const filteredSongs = songs
    .filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getSongsByCategory = (category) => {
    return category === "all" 
      ? filteredSongs 
      : filteredSongs.filter(song => song.category === category);
  };
  
  const handleEditSong = (song) => {
    setSelectedSong(song); // Set the song to be edited
    setIsEditDialogOpen(true); // Open the dialog
  };

  const handleAddSong = (newSong) => {
    setSongs((prevSongs) => [newSong, ...prevSongs]); // 새 곡을 맨 앞에 추가
    setIsAddDialogOpen(false); // 다이얼로그 닫기
  };

  const handleUpdateSong = async (updatedSong) => {
    // Update the song data logic (e.g., send to server or update state)
    const updatedSongs = songs.map(song =>
      song.id === updatedSong.id ? updatedSong : song
    );
    setSongs(updatedSongs); // Update the song list with the updated song
    setIsEditDialogOpen(false); // Close the dialog
  };

  const handleDeleteSong = (songId) => {
    // Handle the delete logic here, e.g., removing the song from state or database
    setSongs(songs.filter((song) => song.id !== songId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to green-400">
      {/* 스포티파이 스타일 프로필 섹션 */}
      <div className="relative mb-0">
        <div className="absolute inset-0 bg-gradient-to-b from-green-100 opacity-90" />
        <div className="relative px-6 py-20">
          <div className="flex items-start gap-8">
            <img 
              src={'https://i.pinimg.com/736x/3e/41/a0/3e41a0f5a2be40db27b20a1ad1a69a43.jpg'}
              alt="Profile"
              className="rounded-full shadow-xl w-full h-auto object-cover"
              style={{ width: '120px', height: '120px' }}
            />
            <div className="text-white">
              <div className="text-sm font-semibold mb-2">Guitar Repertoire</div>
              <h1 className="text-4xl font-bold mb-6">Seohyun</h1>
              <div className="flex items-center gap-6 text-white text-sm">
                <div className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  <span>총 {songs.length}곡</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>2021.12~</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  <span>알고보니밴드</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 검색바 */}
      <div className="relative mb-6 px-6">
        <Search className="absolute left-9 top-3 h-4 w-4 text-gray-600" />
        <Input
          placeholder="곡 제목이나 아티스트로 검색..."
          className="pl-10 bg-white/80 border-gray-200 text-gray-600 placeholder-gray-500 rounded-xl text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 곡 목록 탭 */}
      <div className="px-6">
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white/50 border-b border-gray-200 overflow-x-auto rounded-xl">
            <TabsTrigger value="all" className="text-gray-600 data-[state=active]:bg-white rounded-[8px] px-3 py-1 ml-0.5">
              전체
            </TabsTrigger>
            <TabsTrigger value="band" className="text-gray-600 data-[state=active]:bg-white rounded-[8px] px-3 py-1">
              <Drum className="h-4 w-4 mr-2" />
              밴드 합주곡
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-gray-600 data-[state=active]:bg-white rounded-[8px] px-3 py-1">
              <Guitar className="h-4 w-4 mr-2" />
              개인 연습곡
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="text-gray-600 data-[state=active]:bg-white rounded-[8px] px-3 py-1 mr-0.5">
              <Heart className="h-4 w-4 mr-2" />
              연주하고 싶은 곡
            </TabsTrigger>
          </TabsList>

          {/* 각 탭의 콘텐츠 */}
          {["all", "band", "practice", "wishlist"].map(category => (
            <TabsContent key={category} value={category}>
              <div className="flex flex-col gap-2">
                {getSongsByCategory(category).map(song => (
                  <SongCard key={song.id} song={song} onEdit={handleEditSong} onDelete={handleDeleteSong}/>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* 새로운 곡 추가 버튼 */}
      <button
        className="fixed bottom-6 right-6 bg-blue-400 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-colors"
        onClick={() => setIsAddDialogOpen(true)} // Open the dialog when the button is clicked
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* AddSongDialog 컴포넌트 */}
      <AddSongDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)} // 다이얼로그 닫기 핸들러
        onAdd={handleAddSong} // 곡 추가 핸들러
      />

      {/* EditSongDialog */}
      <EditSongDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)} // Close dialog
        song={selectedSong} // The song to be edited
        onUpdate={handleUpdateSong} // Function to handle the update
      />
    </div>
  );
};

const SongCard = ({ song, onEdit, onDelete }) => (
  <Card className="bg-white/80 hover:bg-white transition-colors border border-gray-200 rounded-xl">
    <CardContent className="p-4">
      <div className="flex items-start gap-4 group">
        {/* Link to YouTube video */}
        <a 
          href={`https://www.youtube.com/watch?v=${song.youtubeId}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="relative flex-shrink-0 w-48 h-28 group"
        >
          <img
            src={`https://img.youtube.com/vi/${song.youtubeId}/mqdefault.jpg`}
            alt={song.title}
            className="w-full h-full object-cover rounded"
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity rounded" />
          <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{song.title}</h3>
              <p className="text-gray-600 mb-2">{song.artist}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="focus:outline-none">
                <div className="p-2 hover:bg-gray-100 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </div>
              </DropdownMenuTrigger>
              {/* Edit option */}
              <DropdownMenuContent className="bg-white border-gray-200 text-gray-700">
                <DropdownMenuItem
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => onEdit(song)} // Use the onEdit prop here
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  <span>수정하기</span>
                </DropdownMenuItem>
                {/* Delete option */}
                <DropdownMenuItem
                  className="text-red-600 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onDelete(song.id)} // Use the onDelete prop here
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>삭제하기</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              {song.genres.map((genre, index) => (
                <span key={index} className="text-xs px-2 py-1 rounded-full bg-green-100 text-gray-900">
                  {genre}
                </span>
              ))}
            </div>
            <span className="text-gray-400 text-sm">•</span>
            <span className="text-gray-500 text-sm">{song.date}</span>
            {song.period && (
              <>
                <span className="text-gray-400 text-sm">•</span>
                <span className="text-gray-600 text-sm font-medium">{song.period}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default GuitarRepertoireApp;