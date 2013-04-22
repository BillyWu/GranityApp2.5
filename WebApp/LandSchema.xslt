<?xml version="1.0" encoding="gb2312" ?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" >
	<xsl:output method="xml" omit-xml-declaration="yes" />
	<xsl:template match="/">
	<XML >
		<xsl:for-each select="*/@*">
			<xsl:attribute name="{name()}"><xsl:value-of select="current()"/></xsl:attribute>
		</xsl:for-each>
		<!-- xsd架构的列信息 -->
		<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata">
			<xsl:for-each select=".//xs:sequence">
				<xsl:copy-of select="./*"></xsl:copy-of>
			</xsl:for-each>
		</xs:schema>
	</XML>
	</xsl:template>
</xsl:stylesheet>