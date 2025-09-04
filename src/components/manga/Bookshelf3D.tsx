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
    const shelfWidth = 235/11; // Approximately 21.82 units wide
    
    // Calculate the total number of shelves needed for all manga series
    let totalShelvesNeeded = 0;
    if (mangaList.length > 0) {
      mangaList.forEach(manga => {
        totalShelvesNeeded += Math.ceil(manga.ownedVolumes.length / 60) || 1;
      });
    }

    const numberOfShelves = Math.max(4, totalShelvesNeeded); // Ensure at least 4 shelves are rendered
    
    return Array.from({ length: numberOfShelves }, (_, i) => ({
      position: [0, i * shelfHeight - (numberOfShelves / 2) * shelfHeight + 1, 0] as [number, number, number],
      width: shelfWidth,
      depth: shelfDepth,
    }));
  }, [mangaList]);

  const bookPositions = useMemo(() => {
    const positions: Array<{ manga: Manga; position: [number, number, number]; volume: number }> = [];
    let shelfIndex = -1;
    const booksPerRow = 60;
    const bookSpacing = 0.35;
    const shelfWidth = 235/11;
    const startX = -shelfWidth / 2 + bookSpacing;

    mangaList.forEach((manga) => {
      shelfIndex++;
      let currentX = startX;
      let booksOnCurrentRow = 0;

      manga.ownedVolumes.forEach((volume) => {
        if (booksOnCurrentRow >= booksPerRow) {
          shelfIndex++;
          currentX = startX;
          booksOnCurrentRow = 0;
        }

        if (shelfIndex >= shelves.length) {
          console.error("Not enough shelves for all the books!");
          return;
        }

        // Use the actual shelf's Y position for alignment
        const shelfY = shelves[shelfIndex].position[1];
        
        positions.push({
          manga,
          position: [currentX, shelfY, 0.2],
          volume: volume,
        });
        
        currentX += bookSpacing;
        booksOnCurrentRow++;
      });
    });
    
    return positions;
  }, [mangaList, shelves]);

  return (
    <div className="h-full w-full">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
          
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          
          <Environment preset="apartment" />
          
          {shelves.map((shelf, index) => (
            <group key={index} position={shelf.position}>
              {/* Shelf surface is now at y=0 within the group */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[shelf.width, 0.1, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              {/* Shelf back */}
              <mesh position={[0, 1, -shelf.depth / 2 + 0.05]}>
                <boxGeometry args={[shelf.width, 2, 0.05]} />
                <meshStandardMaterial color="#654321" roughness={0.9} />
              </mesh>
              {/* Shelf Sides */}
              <mesh position={[-shelf.width / 2, 1, 0]}>
                <boxGeometry args={[0.1, 2.1, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
              <mesh position={[shelf.width / 2, 1, 0]}>
                <boxGeometry args={[0.1, 2.1, shelf.depth]} />
                <meshStandardMaterial color="#8B4513" roughness={0.8} />
              </mesh>
            </group>
          ))}
          
          {bookPositions.map((book) => (
            <MangaSpine
              key={`${book.manga.id}-${book.volume}`}
              title={book.manga.title}
              author={book.manga.author}
              volume={book.volume}
              color={book.manga.color}
              // The book's y-position is the shelf's y-position + half the book's height
              position={[book.position[0], book.position[1] + 1, book.position[2]]}
              onSelect={() => onMangaSelect(book.manga)}
              isOwned={true} // We only render owned books now
            />
          ))}
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={25}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI - Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}