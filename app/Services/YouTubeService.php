<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class YouTubeService
{
    private string $apiKey;
    private string $channelId;

    public function __construct()
    {
        $this->apiKey = config('services.youtube.api_key');
        $this->channelId = config('services.youtube.channel_id');
    }

    public function getShorts(int $maxResults = 12): array
    {
        return Cache::remember('youtube_shorts', 3600, function () use ($maxResults) {
            return $this->fetchShorts($maxResults);
        });
    }

    private function fetchShorts(int $maxResults): array
    {
        $shortsPlaylistId = 'UUSH' . substr($this->channelId, 2);

        $response = Http::get('https://www.googleapis.com/youtube/v3/playlistItems', [
            'part' => 'snippet',
            'playlistId' => $shortsPlaylistId,
            'maxResults' => $maxResults,
            'key' => $this->apiKey,
        ]);

        if ($response->failed()) {
            // Fallback: buscar videos cortos del canal
            return $this->fetchShortsBySearch($maxResults);
        }

        $items = $response->json('items', []);

        return array_map(function ($item) {
            $videoId = $item['snippet']['resourceId']['videoId'];
            return [
                'id' => $videoId,
                'title' => $item['snippet']['title'],
                'thumbnail' => $item['snippet']['thumbnails']['high']['url']
                    ?? $item['snippet']['thumbnails']['medium']['url']
                    ?? $item['snippet']['thumbnails']['default']['url'],
                'url' => "https://www.youtube.com/shorts/{$videoId}",
            ];
        }, $items);
    }

    private function fetchShortsBySearch(int $maxResults): array
    {
        $response = Http::get('https://www.googleapis.com/youtube/v3/search', [
            'part' => 'snippet',
            'channelId' => $this->channelId,
            'type' => 'video',
            'videoDuration' => 'short',
            'order' => 'date',
            'maxResults' => $maxResults,
            'key' => $this->apiKey,
        ]);

        if ($response->failed()) {
            return [];
        }

        $items = $response->json('items', []);

        return array_map(function ($item) {
            $videoId = $item['id']['videoId'];
            return [
                'id' => $videoId,
                'title' => $item['snippet']['title'],
                'thumbnail' => $item['snippet']['thumbnails']['high']['url']
                    ?? $item['snippet']['thumbnails']['medium']['url']
                    ?? $item['snippet']['thumbnails']['default']['url'],
                'url' => "https://www.youtube.com/shorts/{$videoId}",
            ];
        }, $items);
    }
}
