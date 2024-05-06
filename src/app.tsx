import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
// import { lazy } from "solid-js";
import "./app.css";
import Nav from "./components/Nav";
// const Nav = lazy(() => import("~/components/Nav"));

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>DisWiki</Title>
          <Nav />
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
