<?php

/**
 *    This file is part of OXID eShop Community Edition.
 *
 *    OXID eShop Community Edition is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    OXID eShop Community Edition is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with OXID eShop Community Edition.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link      http://www.oxid-esales.com
 * @package   views
 * @copyright (C) OXID eSales AG 2003-2014
 * @version OXID eShop CE
 */

/**
 * Vendor list widget.
 * Forms vendor list.
 */
class oxwVendorList extends oxWidget
{
    /**
     * Current class template name.
     *
     * @var string
     */
    protected $_sThisTemplate = 'widget/footer/vendorlist.tpl';

    /**
     * Template variable getter. Returns vendorlist for search
     *
     * @return array
     */
    public function getVendorlist()
    {
        if ( $this->_aVendorlist === null ) {
            $oVendorTree = oxNew( 'oxvendorlist' );
            $oVendorTree->buildVendorTree( 'vendorlist', null, $this->getConfig()->getShopHomeURL() );
            $this->_aVendorlist = $oVendorTree;
        }
        return $this->_aVendorlist;
    }

}
