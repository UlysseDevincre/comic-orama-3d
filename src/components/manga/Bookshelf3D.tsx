import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Manga } from '@/types/manga';
import { MangaSpine } from './MangaSpine';

interface Bookshelf3DProps {
  mangaList: Manga[];
  onMangaSelect: (manga: Manga) => void;
}

export function Bookshelf3D({ mangaList, onMangaSelect }: Bookshelf3DProps) {
  const shelves = useMemo(() => {
    const shelfHeight = 2.2;
    const shelfDepth = 0.5;
    const shelfWidth = 8;
    const numberOfShelves = 4;
    
    return Array.from({ length: numberOfShelves }, (_, i) => ({
      position: [0, i * shelfHeight - numberOfShelves + 2, 0] as [number, number, number],
      width: shelfWidth,
      depth: shelfDepth,
    }));
  }, []);

  const bookPositions = useMemo(() => {
    const positions: Array<{ manga: Manga; position: [number, number, number]; volume: number; isOwned: boolean }> = [];
    let currentShelf = 0;
    let currentX = -3.8;
    
    mangaList.forEach((manga) => {
      for (let vol = 1; vol <= manga.totalVolumes; vol++) {
        const isOwned = manga.ownedVolumes.includes(vol);
        
        if (currentX > 3.8) {
          currentShelf++;
          currentX = -3.8;
        }
        
        const shelfY = currentShelf * 2.2 - 3 + 1;
        positions.push({
          manga,
          position: [currentX, shelfY, 0.2],
          volume: vol,
          isOwned
        });
        
        currentX += 0.35;
      }
    });
    
    return positions;
  }, [mangaList]);

  return (
    <div className="h-full w-full">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.6} castShadow />
          <pointLight position={[-5, 5, 5]} intensity={0.3} />
          
          {/* Environment */}
          <Environment preset="apartment" />
          
          {/* Bookshelves */}
          {shelves.map((shelf, index) => (
            <group key={index} position={shelf.position}>
              {/* Shelf surface */}
              <mesh position={[0, -1, 0]}>
                <boxGeometry args={[shelf.width, 0.1, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              
              {/* Shelf back */}
              <mesh position={[0, 0, -shelf.depth / 2]}>
                <boxGeometry args={[shelf.width, 2, 0.05]} />
                <meshStandardMaterial color="#654321" roughness={0.9} />
              </mesh>
              
              {/* Left side */}
              <mesh position={[-shelf.width / 2, 0, 0]}>
                <boxGeometry args={[0.1, 2, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              
              {/* Right side */}
              <mesh position={[shelf.width / 2, 0, 0]}>
                <boxGeometry args={[0.1, 2, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
            </group>
          ))}
          
          {/* Books */}
          {bookPositions.map((book, index) => (
            <MangaSpine
              key={`${book.manga.id}-${book.volume}`}
              title={book.manga.title}
              author={book.manga.author}
              volume={book.volume}
              color={book.manga.color}
              position={book.position}
              onSelect={() => onMangaSelect(book.manga)}
              isOwned={book.isOwned}
            />
          ))}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}