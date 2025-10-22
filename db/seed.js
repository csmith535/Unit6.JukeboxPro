import db from "#db/client";
import bcrypt from "bcrypt";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/user";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create users
  const users = [];
  for (let i = 1; i <= 3; i++) {
    const username = "user" + i;
    const hashedPassword = await bcrypt.hash("password" + i, 3);
    const user = await createUser(username, hashedPassword);
    users.push(user);
    console.log(`Created user: ${username}`);
  }

  // Create tracks
  const tracks = [];
  for (let i = 1; i <= 20; i++) {
    const track = await createTrack("Track " + i, i * 50000);
    tracks.push(track);
    console.log(`Created tracks`)
  }

  // Create playlists for users
  const playlists = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const playlistCount = 2 + (i % 2);
    
    for (let j = 1; j <= playlistCount; j++) {
      const playlistName = `Playlist ${j} by ${user.username}`;
      const description = `lorem ipsum playlist description`;
      const playlist = await createPlaylist(playlistName, description, user.id);
      playlists.push(playlist);
      console.log(`Created playlist: ${playlistName} for user ${user.username}`);
    }
  }

  // Add tracks to playlists
  for (let i = 0; i < playlists.length; i++) {
    const playlist = playlists[i];
    const trackCount = 5 + (i % 3);
    
    for (let j = 0; j < trackCount; j++) {
      const trackIndex = (i * trackCount + j) % tracks.length; // selecting random track
      const track = tracks[trackIndex];
      await createPlaylistTrack(playlist.id, track.id);
    }
    console.log(`Added ${trackCount} tracks to playlist: ${playlist.name}`);
  }
}
