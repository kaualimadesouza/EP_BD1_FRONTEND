import React from "react";

function Footer() {
    return (
        <footer className="bg-zinc-900 text-white py-8 px-4 md:px-8 lg:px-70 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Copyright */}
                <div className="text-center">
                    <div className="text-sm text-gray-400 transition-colors duration-200 hover:text-gray-300">
                        © 2025 EP_BD1_FRONTEND – Todos os direitos reservados.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;