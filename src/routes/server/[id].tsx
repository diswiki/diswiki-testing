import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import WikiUser from "~/components/WikiUser";
import wikiChannel from "~/components/WikiChannel";

export default function ServerID() {
    const params = useParams();

    return (
        <main>
            <Title>DisWiki</Title>
            <div id="wiki-container">
                <div id="wiki-toc-container">
                    <h2>Table of Contents</h2>
                    <hr />
                    <ol id="wiki-toc">
                        <li>
                            <a href="#">
                                <strong>To Top</strong>
                            </a>
                        </li>
                        {/* <!-- Variable things that are added by JavaScript --> */}
                    </ol>
                </div>
                <div id="wiki-wrapper">
                    <h1 id="wiki-page-title">Loading...</h1>
                    <hr />
                    <span id="wiki-page-info">
                        <span id="wiki-page-info-container">
                            <p id="wiki-last-edited">Last edited ? minutes ago...</p>
                            <span>
                                <span>
                                    <i class="bx bxs-time"></i>
                                    <p id="wiki-read-time">? minute read</p>
                                </span>
                                <span>
                                    <i class="bx bxs-like"></i>
                                    <p id="wiki-like-count">? likes</p>
                                </span>
                                <span>
                                    <i id="wiki-share" class="bx bxs-share"></i>
                                    <p id="wiki-share-count">? shares</p>
                                </span>
                            </span>
                        </span>
                    </span>
                    <hr />
                    <div id="wiki-content-wrapper">
                        <div id="wiki-content">
                            {/* <!-- Variable things that are added by JavaScript --> */}
                            <p>Loading...</p>
                        </div>
                        <div id="wiki-sidebar">
                            <img
                                id="wiki-sidebar-server-icon"
                                src="https://raw.githubusercontent.com/diswiki/resources/main/assets/loading.gif?raw=true"
                            />
                            <div class="wiki-sidebar-portion">
                                <h4>Server Info</h4>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Members</th>
                                            <td id="wiki-sidebar-members">Loading...</td>
                                        </tr>
                                        <tr>
                                            <th>Currently Online</th>
                                            <td id="wiki-sidebar-online">Loading...</td>
                                        </tr>
                                        <tr>
                                            <th>Server Creation</th>
                                            <td id="wiki-sidebar-server-creation">Loading...</td>
                                        </tr>
                                        <tr>
                                            <th>Server Age</th>
                                            <td id="wiki-sidebar-server-age">Loading...</td>
                                        </tr>
                                        <tr>
                                            <th>Server ID</th>
                                            <td id="wiki-sidebar-server-id">Loading...</td>
                                        </tr>
                                        <tr>
                                            <th>Server Owner</th>
                                            <td>
                                                <WikiUser
                                                    id="wiki-sidebar-server-owner"
                                                    name="Loading..."
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="wiki-sidebar-portion">
                                <h4>Wiki Info</h4>
                                <table>
                                    <tbody>
                                        <tr>
                                            <th>Wiki Owner</th>
                                            <td>
                                                <WikiUser
                                                    id="wiki-sidebar-wiki-owner"
                                                    name="Loading..."
                                                />
                                            </td>
                                        </tr>
                                        <tr id="wiki-sidebar-wiki-admins-row">
                                            <th>Wiki Admins</th>
                                            <td>
                                                <WikiUser name="Loading..." />
                                                <br />
                                                <WikiUser name="Loading..." />
                                                <br />
                                                <WikiUser name="Loading..." />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Wiki Creation</th>
                                            <td id="wiki-sidebar-wiki-creation">Loading...</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <span style="display: inline-flex; gap: 5px; margin-top: 10px; margin-bottom: 5px; width: 100%;">
                                <i
                                    id="wiki-action-like"
                                    class="button b-grey bx bxs-like bx-md"
                                    style="flex-grow: 1; text-align: center;"
                                ></i>
                                <i
                                    id="wiki-action-share"
                                    class="button b-grey bx bxs-share-alt bx-md"
                                    style="flex-grow: 1; text-align: center;"
                                ></i>
                                <i
                                    id="wiki-action-report"
                                    class="button b-grey bx bxs-error bx-md"
                                    style="flex-grow: 1; text-align: center;"
                                ></i>
                            </span>
                            <a
                                id="wiki-join"
                                href="#"
                                class="button b-blurple"
                                target="_blank"
                            >
                                Join
                            </a>
                        </div>
                    </div>
                </div>
                <div id="wiki-spacer">{/* <!-- <p>hi mom</p> --> */}</div>
            </div>
        </main>
    );
}
