import { NextRequest, NextResponse } from 'next/server';
import { analyticsDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    let timeframe = new Date(now - 24 * 60 * 60 * 1000);

    const timeframeParam = request.nextUrl.searchParams.get('timeframe') ?? 'daily';
    if (timeframeParam === 'weekly') {
      timeframe = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    let aggregatedData: any[] = [];
    let totalHeartbeatsReceived = 0;

    if (timeframeParam === 'weekly') {
      aggregatedData = await analyticsDb.weeklyStats.findMany({
        where: {
          weekStart: {
            gte: timeframe,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          totalTime: 'desc',
        },
      });

      totalHeartbeatsReceived = aggregatedData.reduce((sum, stat) => sum + stat.heartbeats, 0);
    } else {
      aggregatedData = await analyticsDb.dailyStats.findMany({
        where: {
          date: {
            gte: timeframe,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          totalTime: 'desc',
        },
      });

      totalHeartbeatsReceived = aggregatedData.reduce((sum, stat) => sum + stat.heartbeats, 0);
    }

    if (aggregatedData.length === 0) {
      const responseData = { data: [], totalHeartbeatsReceived: 0 };
      return NextResponse.json(responseData, { status: 200 });
    }

    // Transform aggregated data to leaderboard format
    const leaderboard = aggregatedData.map(stat => {
      const languages = Object.keys(stat.languages as Record<string, number>)
        .sort((a, b) => (stat.languages as Record<string, number>)[b] - (stat.languages as Record<string, number>)[a])
        .slice(0, 7);

      return {
        userId: stat.user.id,
        username: stat.user.username,
        profilePictureUrl: stat.user.profilePictureUrl ?? null,
        totalTimeSpent: stat.totalTime,
        languages: languages,
      };
    });

    const responseData = { data: leaderboard, totalHeartbeatsReceived };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch leaderboard data', details: errorMessage }, { status: 500 });
  } finally {
    // await prisma.$disconnect(); // Generally not needed in serverless environments
  }
}
