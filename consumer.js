import 'dotenv/config';
import RabbitMQService from './src/utils/rabbitmq.js';
import MailService from './src/utils/mail.js';
import PlaylistRepositories from './src/services/playlists/repositories/playlist-repositories.js';

class PlaylistConsumer {
    async consume() {
        try {
            console.log('🚀 Starting Playlist Export Consumer...');

            await RabbitMQService.consumeQueue('export:playlist', async (message) => {
                console.log('📨 Processing message:', message);

                const { playlistId, targetEmail } = message;

                try {
                    const playlistData = await PlaylistRepositories.getPlaylistForExport(playlistId);

                    if (!playlistData) {
                        console.error('❌ Playlist not found:', playlistId);
                        return;
                    }

                    const jsonContent = JSON.stringify(playlistData, null, 2);

                    await MailService.sendEmail(
                        targetEmail,
                        `Export Playlist: ${playlistData.playlist.name}`,
                        jsonContent
                    );

                    console.log('✅ Playlist exported and email sent to:', targetEmail);
                } catch (error) {
                    console.error('❌ Error processing playlist export:', error);
                    throw error;
                }
            });

            console.log('✅ Consumer is running. Press Ctrl+C to exit.');
        } catch (error) {
            console.error('❌ Consumer error:', error);
            process.exit(1);
        }
    }
}

const consumer = new PlaylistConsumer();
consumer.consume();

process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down consumer...');
    await RabbitMQService.close();
    process.exit(0);
});