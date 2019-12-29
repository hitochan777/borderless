package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

type ProxyHandler struct {
	p *httputil.ReverseProxy
}

func (ph *ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	ph.p.ServeHTTP(w, r)
}

type apiHandler struct{}

func (apiHandler) ServeHTTP(http.ResponseWriter, *http.Request) {}

func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}

func NewReverseProxy(target *url.URL) *httputil.ReverseProxy {
	targetQuery := target.RawQuery
	director := func(req *http.Request) {
		req.URL.Scheme = target.Scheme
		req.URL.Host = target.Host
		req.URL.Path = singleJoiningSlash(target.Path, req.URL.Path)
		if targetQuery == "" || req.URL.RawQuery == "" {
			req.URL.RawQuery = targetQuery + req.URL.RawQuery
		} else {
			req.URL.RawQuery = targetQuery + "&" + req.URL.RawQuery
		}
		req.Host = target.Host
		if _, ok := req.Header["User-Agent"]; !ok {
			// explicitly disable User-Agent so it's not set to default value
			req.Header.Set("User-Agent", "")
		}
	}
	return &httputil.ReverseProxy{Director: director}
}

func main() {
	API_ENDPOINT := os.Getenv("API_ENDPOINT")
	if API_ENDPOINT == "" {
		log.Fatal("API_ENDPOINT is not defined")
	}
	APP_ENDPOINT := os.Getenv("APP_ENDPOINT")
	if APP_ENDPOINT == "" {
		log.Fatal("APP_ENDPOINT is not defined")
	}
	apiEndpoint, err := url.Parse(API_ENDPOINT)
	if err != nil {
		panic(err)
	}
	appEndpoint, err := url.Parse(APP_ENDPOINT)
	if err != nil {
		panic(err)
	}
	apiProxy := NewReverseProxy(apiEndpoint)
	appProxy := NewReverseProxy(appEndpoint)
	mux := http.NewServeMux()
	mux.Handle("/graphql", &ProxyHandler{apiProxy})
	mux.Handle("/", &ProxyHandler{appProxy})
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Listening on %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
