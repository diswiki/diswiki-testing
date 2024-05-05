window.addEventListener('DOMContentLoaded', () => {
    let searchDropdown = document.getElementById('js-search-dropdown');
    let searchDropdownChevron = document.getElementById('js-search-chevron');
    let searchInput = document.getElementById('js-search-input');

    if (searchDropdown != null && searchDropdownChevron != null && searchInput != null) {
        searchDropdown.addEventListener('click', (e) => {
            searchDropdownChevron.classList.toggle('bx-rotate-90');
            // e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (e.target != searchDropdown && e.target != searchDropdownChevron) {
                searchDropdownChevron.classList.remove('bx-rotate-90');
            }
        });

        searchDropdown.addEventListener('change', (e) => {
            searchInput.setAttribute('placeholder', `Search for ${e.target.value}s...`);
        });
    }
});