$(document).ready(function () {
    var itemQuantity = {};
    var itemPrices = {};

    function calculateTotalAfterTax(totalBeforeTax) {
        var tax = totalBeforeTax * 0.1;
        var totalAfterTax = totalBeforeTax + tax;
        return {
            tax: tax,
            totalAfterTax: totalAfterTax,
        };
    }

    function updateTotal(total) {
        $("#totalPrice").text(total.toLocaleString("id-ID"));
    }

    function updateTax(tax) {
        $("#taxDiscount").text(tax.toLocaleString("id-ID"));
    }

    function updateTotalAmount(totalAmount) {
        $("#totalAmount").text("Rp. " + totalAmount.toLocaleString("id-ID"));
    }

    function updateTotalAfterQuantityChange() {
        var totalPrice = 0;
        for (var item in itemQuantity) {
            totalPrice += itemPrices[item] * itemQuantity[item];
        }

        var { tax, totalAfterTax } = calculateTotalAfterTax(totalPrice);
        updateTotal(totalPrice);
        updateTax(tax);
        updateTotalAmount(totalAfterTax);
    }

    $('.isi').on('click', function () {
        var $clickedItem = $(this);
        var itemName = $clickedItem.find('p').first().text().trim();
        var itemPriceText = $clickedItem.find('h1').text().trim();
        var itemPrice = parseFloat(itemPriceText.replace('Rp. ', '').replace('.', '').replace(',', '.'));

        if (!isNaN(itemPrice)) {
            var formattedItemName = itemName.replace(/\s+/g, '_').toLowerCase();

            if (!itemQuantity[formattedItemName]) {
                itemQuantity[formattedItemName] = 1;
                itemPrices[formattedItemName] = itemPrice;
            } else {
                itemQuantity[formattedItemName]++;
            }

            var isItemExist = $('.belanja .barang .detail-kiri p').filter(function () {
                return $(this).text().includes(itemName);
            }).length > 0;

            if (!isItemExist) {
                var newElement = `
                    <div class="barang">
                        <div class="detail-kiri">
                            <p>${itemName}</p>
                            <p class="normal">Harga : ${itemPriceText}</p>
                        </div>
                        <div class="detail-kanan">
                            <p class="normal" style="display: flex; 
                            justify-content: space-between; 
                            gap: 1em;">
                               
                            Quantity: <span id="stock_${formattedItemName}">
                                ${itemQuantity[formattedItemName]}
                                </span>
                            </p>
                        </div>
                        <button class="remove">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                `;

                $('.belanja').append(newElement);
                updateTotalAfterQuantityChange();
            } else {
                $('#stock_' + formattedItemName).text(itemQuantity[formattedItemName]);
                updateTotalAfterQuantityChange();
            }
        } else {
            console.error('Invalid item price');
        }
    });

    $(".belanja").on("click", ".remove ", function () {
        var $item = $(this).closest(".barang");
        var itemNameElement = $item.find(".detail-kiri p").first();
        var itemName = itemNameElement.text().trim();
        var itemPriceText = $item.find(".detail-kiri .normal").text().trim();
        var itemPrice = parseFloat(itemPriceText.replace("Harga : Rp. ", "").replace(",", "."));

        if (!isNaN(itemPrice)) {
            var totalPriceText = $("#totalPrice").text().trim();
            var currentTotal = parseFloat(totalPriceText.replace("Rp. ", "").replace(".", "").replace(",", ".")) || 0;

            var quantityElement = $("#stock_" + itemName.replace(/\s+/g, "_").toLowerCase());
            var currentQuantity = parseInt(quantityElement.text());

            if (currentQuantity > 1) {
                currentQuantity--;
                quantityElement.text(currentQuantity);
                itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()]--;
                updateTotalAfterQuantityChange();
            } else {
                delete itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()];
                $item.remove();
                updateTotalAfterQuantityChange();
            }
        } else {
            console.error("Invalid item price");
        }
    });

    $("#bayar").click(function () {
        console.log("Checkout button clicked!");
        window.print();
    });

    $(document).keydown(function (event) {
        if (event.ctrlKey && event.key === "p") {
            console.log("Ctrl + P pressed. Printing...");
            event.preventDefault();
            window.print();
        }
    });

    $("#searchIcon").on("click", function () {
        $("#searchInput").fadeToggle("fast");
        $("#searchInput").focus();
    });

    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".isi").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    $("#searchInput").on("focusout", function () {
        $(this).fadeOut("fast");
    });

    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            $("#searchInput").fadeOut("fast");
        }
    });

    $("#sortByName").on("click", function () {
        var items = $(".isi").detach();
        let ascending = true;

        items.sort(function (a, b) {
            var nameA = $(a).find("p").text().toUpperCase();
            var nameB = $(b).find("p").text().toUpperCase();

            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });

        ascending = !ascending;

        $(".kanan > section").html(items);
    });

    $(".iconplus").hover(
        function () {
            $(this).closest(".isi").addClass("hovered");
        },
        function () {
            $(this).closest(".isi").removeClass("hovered");
        }
    );

    $(".isi").on("click", function () {
        $(this).find(".iconminus").show();
    });
});