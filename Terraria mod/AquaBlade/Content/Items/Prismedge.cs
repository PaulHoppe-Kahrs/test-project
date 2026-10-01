using Microsoft.Xna.Framework;
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace AquaBlade.Content.Items;

public sealed class Prismedge : ModItem
{
    public override void SetDefaults()
    {
        Item.damage = 2000;
        Item.DamageType = DamageClass.Melee;
        Item.width = 48;
        Item.height = 48;
        Item.useTime = 22;
        Item.useAnimation = 22;
        Item.useStyle = ItemUseStyleID.Swing;
        Item.knockBack = 12f;
        Item.value = Item.buyPrice(gold: 1);
        Item.rare = ItemRarityID.Red;
        Item.UseSound = SoundID.Item1;
        Item.autoReuse = true;
        Item.scale = 1.2f;
    }

    public override void UseStyle(Player player, Rectangle heldItemFrame)
    {
        float progress = 1f - player.itemAnimation / (float)player.itemAnimationMax;
        float swing = MathHelper.SmoothStep(-2.4f, 1.1f, progress);
        player.itemRotation = swing * player.direction;

        if (player.itemAnimation % 3 == 0)
        {
            Vector2 trailPosition = player.MountedCenter +
                new Vector2(MathF.Cos(player.itemRotation), MathF.Sin(player.itemRotation)) * 42f;
            int dustIndex = Dust.NewDust(
                trailPosition,
                8,
                8,
                DustID.GemDiamond,
                player.direction * 1.2f,
                -0.8f,
                100,
                Color.Cyan,
                1.25f);
            Main.dust[dustIndex].noGravity = true;
        }

        Lighting.AddLight(player.MountedCenter, 0.05f, 0.55f, 0.45f);
    }

    public override void OnHitNPC(Player player, NPC target, NPC.HitInfo hit, int damageDone)
    {
        for (int i = 0; i < 8; i++)
        {
            Vector2 velocity = Main.rand.NextVector2Circular(3f, 3f);
            int dustIndex = Dust.NewDust(
                target.position,
                target.width,
                target.height,
                DustID.GemDiamond,
                velocity.X,
                velocity.Y,
                80,
                Color.Cyan,
                1.5f);
            Main.dust[dustIndex].noGravity = true;
        }
    }

    public override void AddRecipes()
    {
        CreateRecipe()
            .AddIngredient(ItemID.DirtBlock, 1)
            .Register();
    }
}
