package com.lumen.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Deque;
import java.util.LinkedList;

@Component
public class RateLimitingFilter extends GenericFilterBean {

    @Value("${rate-limiter.maxRequestsPerMinute:60}")
    private int maxRequestsPerMinute;

    private final ConcurrentHashMap<String, Deque<Instant>> map = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        String ip = req.getRemoteAddr();
        Deque<Instant> dq = map.computeIfAbsent(ip, k -> new LinkedList<>());

        synchronized (dq) {
            Instant now = Instant.now();
            // remove timestamps older than 60s
            while (!dq.isEmpty() && dq.peekFirst().isBefore(now.minusSeconds(60))) {
                dq.removeFirst();
            }

            if (dq.size() >= maxRequestsPerMinute) {
                HttpServletResponse res = (HttpServletResponse) response;
                res.setStatus(HttpServletResponse.SC_TOO_MANY_REQUESTS);
                res.setContentType("application/json");
                res.getWriter().write("{\"error\":\"Too many requests\"}");
                return;
            }
            dq.addLast(now);
        }

        chain.doFilter(request, response);
    }
}
