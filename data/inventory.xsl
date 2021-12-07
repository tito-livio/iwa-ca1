<?xml version="1.0" ?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <table id="inventoryTable" class="mt-2 mb-2" border="1" class="indent">
            <thead>
                <tr align="left">
                    <th style="width: 5%">Select</th>
                    <th style="width: 35%">Name</th>
                    <th style="width: 15%">Fuel</th>
                    <th style="width: 15%">Price</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="/carsList/carType">
                    <tr>
                        <td colspan="4" class="category-row">
                            <xsl:value-of select="@name" />
                        </td>
                    </tr>
                    <xsl:for-each select="car">
                        <tr id="{position()}">
                            <xsl:attribute name="isEco">
                                <xsl:value-of select="boolean(@isEco)" />
                            </xsl:attribute>
                            <td align="center">
                                <input name="selectCar" type="checkbox"  />
                            </td>
                            <td>
                                <xsl:value-of select="name" />
                            </td>
                            <td>
                                <xsl:value-of select="fuelType" />
                            </td>
                            <td id="price" algin="right">
                                <xsl:value-of select="price" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>