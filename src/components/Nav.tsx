import { createSignal } from "solid-js";
import "./Nav.css";

export default function Nav() {
    //   const [count, setCount] = createSignal(0);
    var dropdownValue = 'server';

    function toggleDropdownChevron() {
        let chevron = document.getElementById('js-search-chevron');
        let transform = chevron!.style.transform;
        if (transform.includes('90deg')) {
            chevron!.style.transform = "rotate(0deg)";   
        } else {
            chevron!.style.transform = "rotate(90deg)";
        }
    
        // Add event listener to remove rotation when clicking off
        document.addEventListener('click', (e:any) => {
            if (e.target.id !== 'js-search-dropdown' && e.target.id !== 'js-search-chevron') {
                chevron!.style.transform = "rotate(0deg)";
            }
        });
    
        // Set the global variable to the dropdown value
        let dropdown = document.getElementById('js-search-dropdown') as HTMLSelectElement;
        dropdownValue = dropdown.value;
        updatePlaceholder(dropdown.value); // Update placeholder when dropdown value changes
    }
    
    function updatePlaceholder(value:string) {
        let searchInput = document.getElementById('js-search-input') as HTMLInputElement;
        searchInput.placeholder = `Search for ${value}s...`;
    }



    return (
        <nav>
            <div id="nav-container">

                <div class="portion">
                    <span>
                        <i class="button b-square b-grey bx bx-menu bx-md"></i>
                        <a href="#" id="donate-button" class="button b-green">Donate</a>
                        <div class="searchbar">
                            <span onClick={toggleDropdownChevron}>
                                <i id="js-search-chevron" class="bx bx-chevron-right"></i>
                                <select name="dropdown" id="js-search-dropdown">
                                    <option value="server">Server</option>
                                    <option value="user">User</option>
                                </select>
                                <input type="text" name="search" id="js-search-input" placeholder="Search for servers..." />
                            </span>
                            <span>
                                <i class="button b-square b-blurple bx bxs-send"></i>
                            </span>
                        </div>
                    </span>
                </div>
                <div class="portion">
                    <span>
                        <h1 style="color:white;font-family: 'Passion One', sans-serif;
                    font-weight: 500;
                    font-style: normal;
                    font-size: 3.5rem;">DisWiki</h1>
                    </span>
                </div>
                <div class="portion">
                    <span>
                        <a href="#" class="button b-blurple">Sign in</a>
                    </span>
                </div>
            </div>
        </nav>
    );
}
