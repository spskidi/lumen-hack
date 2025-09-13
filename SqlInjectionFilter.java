package com.lumen.filter;

import java.io.IOException;
import java.util.List;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.GenericFilter;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SqlInjectionFilter extends GenericFilter {

    private static final Logger logger = LoggerFactory.getLogger(SqlInjectionFilter.class);

    // Basic patterns (secondary defense only)
    private final List<Pattern> patterns = List.of(
        Pattern.compile("(?i)union\\s+select"),
        Pattern.compile("(?i)or\\s+1\\s*=\\s*1"),
        Pattern.compile("(?i)--"),
        Pattern.compile("(?i);\\s*drop\\s+table"),
        Pattern.compile("(?i)xp_\\w+"),
        Pattern.compile("(?i)UNION\\s+ALL\\s+SELECT")
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        // Check query string and body for suspicious patterns
        String qs = req.getQueryString() == null ? "" : req.getQueryString();
        if (isSuspicious(qs) || isSuspicious(getBodySnippet(req))) {
            logger.warn("Suspicious input detected from {} - blocking. qs=[{}]", req.getRemoteAddr(), qs);
            HttpServletResponse res = (HttpServletResponse) response;
            res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            res.setContentType("application/json");
            res.getWriter().write("{\"error\":\"Malformed request\"}");
            return;
        }
        chain.doFilter(request, response);
    }

    private boolean isSuspicious(String s) {
        if (s == null || s.isBlank()) return false;
        for (Pattern p : patterns) {
            if (p.matcher(s).find()) return true;
        }
        return false;
    }

    // minimal body snippet extraction - not reading entire InputStream to avoid interfering with body consumption
    private String getBodySnippet(HttpServletRequest req) {
        // Some servers require special wrappers to read body; keep simple for demo
        return "";
    }
}
