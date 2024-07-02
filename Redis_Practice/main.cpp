#pragma once

#include <iostream>
#include <stdlib.h>
#include <hiredis/hiredis.h>
#include <WinSock2.h>
#include <WS2tcpip.h>
#include <mutex>
#include <vector>
#include <ctime>

const short CONTEXT_COUNT = 5;
const short THREAD_COUNT = 10;

std::vector<redisContext*> rc;
std::mutex* m;

void func(int key_, int value_)
{
    bool set = false;

    redisReply* reply = nullptr;

    while (!set)
    {
        for (int i = 0; i < CONTEXT_COUNT; i++)
        {
            if (m[i].try_lock())
            {
                reply = reinterpret_cast<redisReply*>(redisCommand(rc[i], "SETEX %d 60 %d", key_, value_));
                set = true;
                m[i].unlock();
                freeReplyObject(reply);
                break;
            }
        }

        std::this_thread::yield();
    }

    int cnt = 0;

    while (cnt < 1000)
    {
        set = false;

        for (int i = 0; i < CONTEXT_COUNT; i++)
        {
            if (m[i].try_lock())
            {
                reply = reinterpret_cast<redisReply*>(redisCommand(rc[i], "GET %d", key_));
                set = true;
                m[i].unlock();
                cnt++;
                freeReplyObject(reply);
            }
        }


        if (!set)
        {
            std::this_thread::yield();
        }
    }

    return;
}

int main()
{
    m = new std::mutex[CONTEXT_COUNT];

    std::vector<std::thread> threads;

    rc.resize(CONTEXT_COUNT);
    for (int i = 0; i < CONTEXT_COUNT; i++)
    {
        rc[i] = redisConnect("127.0.0.1", 6379);
    }

    clock_t st = clock();

    for (int i = 0; i < THREAD_COUNT; i++)
    {
        threads.emplace_back([i]() { func(i, i); });
    }

    for (int i = 0; i < THREAD_COUNT; i++)
    {
        if (threads[i].joinable())
        {
            threads[i].join();
        }
    }

    clock_t end = clock();

    std::cout << end - st << "\n";

    delete[] m;

    for (int i = 0; i < CONTEXT_COUNT; i++)
    {
        if (rc[i])
        {
            redisFree(rc[i]);
        }
    }

    return 0;
}
